import logging
from email.mime.image import MIMEImage
from smtplib import SMTPException
from urllib.parse import urlencode

from conf import APIResponse
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import AppUser
from ..serializers import (
    LoginSerializer,
    ResendVerificationEmailSerializer,
    SignUpSerializer,
    VerifyEmailSerializer,
)

User = get_user_model()
logger = logging.getLogger(__name__)


def _send_verification_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verification_url = (
        f"{settings.FRONTEND_URL}/verify-email?"
        f"{urlencode({'uid': uid, 'token': token})}"
    )
    text_message = (
        f"Hi {user.first_name},\n\n"
        "Thanks for signing up for MyTempHome. Verify your email address by "
        f"opening this link:\n\n{verification_url}\n\n"
        "If you did not create an MyTempHome account, you can ignore this email."
    )
    html_message = render_to_string(
        "emails/verify_email.html",
        {
            "first_name": user.first_name,
            "verification_url": verification_url,
        },
    )
    email = EmailMultiAlternatives(
        subject="Verify your MyTempHome email",
        body=text_message,
        from_email=None,
        to=[user.email],
    )
    email.attach_alternative(html_message, "text/html")

    logo_path = settings.BASE_DIR / "static" / "images" / "logo.png"
    with logo_path.open("rb") as logo_file:
        logo = MIMEImage(logo_file.read(), _subtype="png")
    logo.add_header("Content-ID", "<mytemphome-logo>")
    logo.add_header("Content-Disposition", "inline", filename="mytemphome-logo.png")
    email.attach(logo)
    email.send(fail_silently=False)

    logger.info(
        "Sent email verification message to %s (user ID: %s)", user.email, user.pk
    )


class SignUpView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            with transaction.atomic():
                user = serializer.save()
                _send_verification_email(user)
        except (SMTPException, OSError):
            return APIResponse(
                data={},
                message="Could not send the verification email. Please try again.",
                success=False,
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return APIResponse(
            data={
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
            message="Account created. Check your email to verify your address.",
            status_code=status.HTTP_201_CREATED,
        )


class ResendVerificationEmailView(APIView):
    permission_classes = (AllowAny,)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "verification_email"

    def post(self, request):
        serializer = ResendVerificationEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email_address = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email_address, is_active=True).first()

        if user is not None:
            profile = AppUser.objects.filter(user=user, email_verified=False).first()
            if profile is not None:
                try:
                    _send_verification_email(user)
                except (SMTPException, OSError):
                    logger.exception("Could not resend email verification message")

        return APIResponse(
            data={},
            message=(
                "If an unverified MyTempHome account exists for that email, "
                "a fresh verification link will be sent."
            ),
        )


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        user = User.objects.filter(email__iexact=email).first()

        if user is None or not user.check_password(password) or not user.is_active:
            return APIResponse(
                data={},
                message="Invalid email or password.",
                success=False,
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            profile = user.appuser
        except AppUser.DoesNotExist:
            return APIResponse(
                data={},
                message="Account profile is unavailable.",
                success=False,
                status_code=status.HTTP_403_FORBIDDEN,
            )

        if profile.status == AppUser.Status.BANNED:
            return APIResponse(
                data={},
                message="This account is unavailable.",
                success=False,
                status_code=status.HTTP_403_FORBIDDEN,
            )
        if not profile.email_verified:
            return APIResponse(
                data={},
                message="Verify your email address before logging in.",
                success=False,
                status_code=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)
        return APIResponse(
            data={
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": profile.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
            },
            message="Login successful.",
        )


class TokenRefreshView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return APIResponse(
            data=serializer.validated_data,
            message="Access token refreshed successfully.",
        )


class VerifyEmailView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.verify(serializer.validated_data)

    @staticmethod
    def verify(data):
        try:
            user_id = force_str(urlsafe_base64_decode(data["uid"]))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return APIResponse(
                data={},
                message="The verification link is invalid or expired.",
                success=False,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, data["token"]):
            return APIResponse(
                data={},
                message="The verification link is invalid or expired.",
                success=False,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        profile, _ = AppUser.objects.get_or_create(user=user)
        if profile.email_verified:
            return APIResponse(data={}, message="Email address is already verified.")

        profile.email_verified = True
        profile.save(update_fields=["email_verified", "updated_at"])
        return APIResponse(
            data={
                "id": profile.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            message="Email address verified successfully.",
        )
