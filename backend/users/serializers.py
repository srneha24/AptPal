from pathlib import Path

from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import AppUser

User = get_user_model()


class SignUpSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, trim_whitespace=True)
    last_name = serializers.CharField(max_length=150, trim_whitespace=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )
        return email

    def validate_password(self, value):
        try:
            password_validation.validate_password(value)
        except DjangoValidationError as error:
            raise serializers.ValidationError(error.messages) from error
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        AppUser.objects.create(user=user, email_verified=False)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_email(self, value):
        return value.strip().lower()


class VerifyEmailSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()


class AppUserRetrieveUpdateSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(
        source="user.first_name", max_length=150, required=False
    )
    last_name = serializers.CharField(
        source="user.last_name", max_length=150, required=False
    )
    email = serializers.EmailField(source="user.email", read_only=True)
    phone_number = serializers.CharField(max_length=20, required=False, allow_null=True)
    gender = serializers.ChoiceField(
        choices=AppUser.Gender.choices, required=False, allow_null=True
    )
    image_id = serializers.CharField(read_only=True, allow_null=True)

    def validate_phone_number(self, value):
        if value is not None:
            value = value.strip()
            if (
                AppUser.objects.filter(phone_number=value)
                .exclude(pk=self.instance.pk)
                .exists()
            ):
                raise serializers.ValidationError(
                    "An account with this phone number already exists."
                )
        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        if user_data:
            for field, value in user_data.items():
                setattr(instance.user, field, value)
            instance.user.save(update_fields=user_data.keys())

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance


class ProfilePictureUploadSerializer(serializers.Serializer):
    image = serializers.FileField()

    max_file_size = 5 * 1024 * 1024
    image_signatures = {  # noqa: RUF012
        ".jpg": lambda header: header.startswith(b"\xff\xd8\xff"),
        ".jpeg": lambda header: header.startswith(b"\xff\xd8\xff"),
        ".png": lambda header: header.startswith(b"\x89PNG\r\n\x1a\n"),
        ".webp": lambda header: (
            header.startswith(b"RIFF") and header[8:12] == b"WEBP"
        ),
    }

    def validate_image(self, image):
        if image.size > self.max_file_size:
            raise serializers.ValidationError("Image must be 5 MB or smaller.")

        extension = Path(image.name).suffix.lower()
        signature_check = self.image_signatures.get(extension)
        if signature_check is None:
            raise serializers.ValidationError("Upload a JPG, PNG, or WEBP image.")

        header = image.read(12)
        image.seek(0)
        if not signature_check(header):
            raise serializers.ValidationError(
                "The uploaded file does not match its image format."
            )
        return image
