import logging

from conf import APIResponse
from django.http import HttpResponse
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from users.models import AppUser

from .appwrite_client import AppwriteClient

logger = logging.getLogger(__name__)


class ImageView(APIView):
    """Return an image by its Appwrite image ID."""

    authentication_classes = ()
    permission_classes = (AllowAny,)

    def get(self, request, image_id):
        if not AppUser.objects.filter(image_id=image_id).exists():
            return APIResponse(
                data={},
                message="Image not found.",
                success=False,
                status_code=status.HTTP_404_NOT_FOUND,
            )

        try:
            appwrite_client = AppwriteClient()
            file = appwrite_client.get_file(image_id)
            if not file.mimetype or not file.mimetype.startswith("image/"):
                return APIResponse(
                    data={},
                    message="The requested file is not an image.",
                    success=False,
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                )
            image = appwrite_client.get_file_view(image_id)
        except Exception:
            logger.exception("Appwrite image retrieval failed")
            return APIResponse(
                data={},
                message="The image could not be retrieved.",
                success=False,
                status_code=status.HTTP_502_BAD_GATEWAY,
            )

        response = HttpResponse(image, content_type=file.mimetype)
        response["Cache-Control"] = "public, max-age=3600"
        response["X-Content-Type-Options"] = "nosniff"
        return response
