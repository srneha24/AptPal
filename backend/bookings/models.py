from django.db import models


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    booking_post = models.ForeignKey(
        "posts.BookingPost", on_delete=models.CASCADE, related_name="bookings"
    )
    user = models.ForeignKey(
        "users.AppUser", on_delete=models.CASCADE, related_name="bookings"
    )

    total_guests = models.PositiveIntegerField()
    start_date = models.DateField()
    end_date = models.DateField()

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    cancellation_reason = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"
        indexes = (
            models.Index(fields=["booking_post"]),
            models.Index(fields=["user"]),
            models.Index(fields=["start_date"]),
            models.Index(fields=["end_date"]),
        )
        ordering = ("-id",)


class BookingReview(models.Model):
    booking = models.OneToOneField(
        Booking, on_delete=models.CASCADE, related_name="review"
    )

    rating = models.PositiveIntegerField()  # From 1 to 5, where 5 is the best rating
    review = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Booking Review"
        verbose_name_plural = "Booking Reviews"
        indexes = (
            models.Index(fields=["booking"]),
            models.Index(fields=["rating"]),
        )
        ordering = ("-id",)
