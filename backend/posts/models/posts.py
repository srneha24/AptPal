from django.db import models


class PostAddress(models.Model):
    class Status(models.TextChoices):
        PENDING_APPROVAL = "pending_approval", "Pending Approval"
        PENDING_REAPPROVAL = "pending_reapproval", "Pending Reapproval"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    address = models.CharField(max_length=255)
    region = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country_code = models.CharField(
        max_length=2, default="BD"
    )  # ISO 3166-1 alpha-2 country code
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, blank=True, null=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, blank=True, null=True
    )

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING_APPROVAL
    )
    verified_at = models.DateTimeField(blank=True, null=True)
    verified_by = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="verified_addresses",
    )

    history = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Post Address"
        verbose_name_plural = "Post Addresses"
        indexes = (
            models.Index(fields=["region"]),
            models.Index(fields=["city"]),
            models.Index(fields=["country_code"]),
        )
        ordering = ("-id",)


class Post(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        ARCHIVED = "archived", "Archived"
        SCHEDULED = "scheduled", "Scheduled"

    user = models.ForeignKey(
        "users.AppUser", on_delete=models.CASCADE, related_name="posts"
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    address = models.ForeignKey(
        PostAddress, on_delete=models.CASCADE, related_name="posts"
    )
    currency = models.CharField(max_length=3, default="BDT")

    amenities = models.JSONField(default=list, blank=True)

    click_count = models.PositiveIntegerField(default=0)
    posted_on = models.DateField(null=False, blank=False)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.ACTIVE
    )
    created_from = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="created_posts",
    )

    show_user_email_publicly = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Post"
        verbose_name_plural = "Posts"
        indexes = (
            models.Index(fields=["user"]),
            models.Index(fields=["status"]),
            models.Index(fields=["posted_on"]),
        )
        ordering = ("-id",)


class PostImage(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="images")
    image_id = models.CharField(max_length=50)

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    rejection_reason = models.TextField(blank=True, null=True)

    caption = models.CharField(max_length=255, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Image for Post: {self.post.title}"

    class Meta:
        verbose_name = "Post Image"
        verbose_name_plural = "Post Images"
        indexes = (
            models.Index(fields=["post"]),
            models.Index(fields=["status"]),
        )
        ordering = ("-id",)


class RentPost(models.Model):
    """For posts that are available for rent or sublet, with additional details specific to rental properties."""

    class Preferences(models.TextChoices):
        MALE_ONLY = "male_only", "Male Only"
        FEMALE_ONLY = "female_only", "Female Only"
        ANY_GENDER = "any_gender", "Any Gender"
        FAMILY_ONLY = "family_only", "Family Only"

    class Type(models.TextChoices):
        ROOMATE = "roommate", "Roommate"
        SUBLET = "sublet", "Sublet"
        TENANT = "tenant", "Tenant"

    post = models.OneToOneField(
        Post, on_delete=models.CASCADE, related_name="rent_post"
    )
    available_from = models.DateField()

    rent = models.DecimalField(max_digits=10, decimal_places=2)
    all_inclusive = models.BooleanField(default=False)
    electricity_bill = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    water_bill = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    gas_bill = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    internet_bill = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )

    preferences = models.CharField(
        max_length=20, choices=Preferences.choices, default=Preferences.ANY_GENDER
    )

    type = models.CharField(
        max_length=20, choices=Type.choices, default=Type.TENANT
    )  # Will be set using AI analysis of the post content.

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Rent Post: {self.post.title}"

    class Meta:
        verbose_name = "Rent Post"
        verbose_name_plural = "Rent Posts"
        indexes = (
            models.Index(fields=["post"]),
            models.Index(fields=["available_from"]),
            models.Index(fields=["preferences"]),
            models.Index(fields=["type"]),
        )
        ordering = ("-id",)


class BookingPost(models.Model):
    """For posts that are available for booking, with additional details specific to booking properties."""

    post = models.OneToOneField(
        Post, on_delete=models.CASCADE, related_name="booking_post"
    )
    maximum_guests = models.PositiveIntegerField()
    rent_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_nights = models.PositiveIntegerField(default=1)
    maximum_nights = models.PositiveIntegerField(blank=True, null=True)

    bedrooms = models.PositiveIntegerField(blank=True, null=True)
    beds = models.PositiveIntegerField(blank=True, null=True)
    bathrooms = models.PositiveIntegerField(blank=True, null=True)

    available_indefinitely = models.BooleanField(default=True)
    available_from = models.DateField(blank=True, null=True)
    available_until = models.DateField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking Post: {self.post.title}"

    class Meta:
        verbose_name = "Booking Post"
        verbose_name_plural = "Booking Posts"
        indexes = (
            models.Index(fields=["post"]),
            models.Index(fields=["available_from"]),
            models.Index(fields=["available_until"]),
            models.Index(fields=["available_indefinitely"]),
        )
        ordering = ("-id",)
