from django.contrib import admin

from .models import Booking, BookingReview


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "booking_post",
        "user",
        "start_date",
        "end_date",
        "total_guests",
        "status",
    )
    list_filter = ("status", "start_date", "end_date")
    search_fields = ("booking_post__post__title", "user__user__email")
    autocomplete_fields = ("booking_post", "user")
    readonly_fields = ("created_at", "updated_at")


@admin.register(BookingReview)
class BookingReviewAdmin(admin.ModelAdmin):
    list_display = ("booking", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("booking__booking_post__post__title", "booking__user__user__email")
    autocomplete_fields = ("booking",)
    readonly_fields = ("created_at", "updated_at")
