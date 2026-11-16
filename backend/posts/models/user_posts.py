from django.db import models


class SavedPost(models.Model):
    user = models.ForeignKey(
        "users.AppUser", on_delete=models.CASCADE, related_name="saved_posts"
    )
    post = models.ForeignKey(
        "posts.Post", on_delete=models.CASCADE, related_name="saved_by"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Saved Post"
        verbose_name_plural = "Saved Posts"
        unique_together = ("user", "post")
        indexes = (
            models.Index(fields=["user"]),
            models.Index(fields=["post"]),
        )
        ordering = ("-id",)


class Rentals(models.Model):
    """For tracking rentals of posts by users, with details about the rental period."""

    rent_post = models.ForeignKey(
        "posts.RentPost", on_delete=models.CASCADE, related_name="rentals"
    )
    user = models.ForeignKey(
        "users.AppUser", on_delete=models.CASCADE, related_name="rentals"
    )
    start_date = models.DateField()
    end_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Rental"
        verbose_name_plural = "Rentals"
        indexes = (
            models.Index(fields=["rent_post"]),
            models.Index(fields=["user"]),
            models.Index(fields=["start_date"]),
            models.Index(fields=["end_date"]),
        )
        ordering = ("-id",)
