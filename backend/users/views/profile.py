import logging
from pathlib import Path
from tempfile import TemporaryDirectory

from conf import APIResponse
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from utils import AppwriteClient

from ..models import AppUser
from ..serializers import (
    AppUserRetrieveUpdateSerializer,
    ProfilePictureUploadSerializer,
)

logger = logging.getLogger(__name__)


class AppUserRetrieveUpdateView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AppUserRetrieveUpdateSerializer

    def get_object(self):
        return get_object_or_404(
            AppUser.objects.select_related("user"), user=self.request.user
        )

    def retrieve(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile)
        return APIResponse(
            data=serializer.data,
            message="Profile retrieved successfully.",
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(profile, "_prefetched_objects_cache", None):
            profile._prefetched_objects_cache = {}

        return APIResponse(
            data=serializer.data, message="Profile updated successfully."
        )

    def perform_update(self, serializer):
        with transaction.atomic():
            serializer.save()


class ProfilePictureUploadView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        profile = get_object_or_404(AppUser, user=request.user)
        serializer = ProfilePictureUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        image = serializer.validated_data["image"]

        old_image_id = profile.image_id
        suffix = Path(image.name).suffix.lower()

        try:
            appwrite_client = AppwriteClient()
            with TemporaryDirectory() as temp_dir:
                temp_path = Path(temp_dir) / f"app_user-{profile.id}{suffix}"
                with temp_path.open("wb") as temp_file:
                    for chunk in image.chunks():
                        temp_file.write(chunk)
                uploaded_file = appwrite_client.upload_file(
                    str(temp_path), folder="profile_pictures/"
                )
        except Exception:
            logger.exception("Appwrite profile picture upload failed")
            return APIResponse(
                data={},
                message="The profile picture could not be uploaded.",
                success=False,
                status_code=status.HTTP_502_BAD_GATEWAY,
            )

        profile.image_id = uploaded_file.id
        try:
            with transaction.atomic():
                profile.save(update_fields=["image_id", "updated_at"])
        except Exception:
            try:
                appwrite_client.delete_file(uploaded_file.id)
            except Exception:
                logger.exception("Could not remove an unreferenced Appwrite file")
            raise

        if old_image_id and old_image_id != uploaded_file.id:
            try:
                appwrite_client.delete_file(old_image_id)
            except Exception:
                logger.exception("Could not delete the replaced profile picture")

        return APIResponse(
            data={"image_id": profile.image_id},
            message="Profile picture uploaded successfully.",
        )
