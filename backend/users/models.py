from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra):
        if not email:
            raise ValueError("Email is required")
        user = self.model(email=self.normalize_email(email), **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra)

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra)


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # noqa: RUF012

    objects = UserManager()


class AppUser(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        BANNED = "banned", "Banned"

    class VerificationStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        NOT_REQUIRED = "not_required", "Not Required"

    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        OTHER = "other", "Other"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    image_id = models.CharField(max_length=50, blank=True, null=True)
    gender = models.CharField(
        max_length=10, choices=Gender.choices, blank=True, null=True
    )
    national_id_image_id = models.CharField(max_length=50, blank=True, null=True)

    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.ACTIVE
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.NOT_REQUIRED,
    )
    banned_at = models.DateTimeField(blank=True, null=True)
    banned_reason = models.TextField(blank=True, null=True)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="verified_users",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email

    class Meta:
        verbose_name = "App User"
        verbose_name_plural = "App Users"
        indexes = (
            models.Index(fields=["user"]),
            models.Index(fields=["phone_number"]),
            models.Index(fields=["status"]),
            models.Index(fields=["verification_status"]),
            models.Index(fields=["verified_by"]),
            models.Index(fields=["verified_by", "verification_status"]),
            models.Index(fields=["banned_at"]),
        )
        ordering = ("id",)
