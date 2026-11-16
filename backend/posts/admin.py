from django.contrib import admin

from .models import (
    BookingPost,
    Post,
    PostAddress,
    PostConversation,
    PostImage,
    PostMessage,
    RentPost,
    Rentals,
    SavedPost,
)


@admin.register(PostAddress)
class PostAddressAdmin(admin.ModelAdmin):
    list_display = ("address", "city", "region", "country_code", "status", "verified_by")
    list_filter = ("status", "country_code", "region")
    search_fields = ("address", "city", "region", "postal_code")
    readonly_fields = ("created_at", "updated_at")


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 0


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "address", "status", "posted_on", "click_count")
    list_filter = ("status", "posted_on")
    search_fields = ("title", "description", "user__user__email", "address__city")
    autocomplete_fields = ("user", "address", "created_from")
    readonly_fields = ("click_count", "created_at", "updated_at")
    inlines = (PostImageInline,)


@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ("post", "image_id", "status", "caption", "created_at")
    list_filter = ("status",)
    search_fields = ("post__title", "image_id", "caption")
    autocomplete_fields = ("post",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(RentPost)
class RentPostAdmin(admin.ModelAdmin):
    list_display = ("post", "type", "rent", "available_from", "preferences", "all_inclusive")
    list_filter = ("type", "preferences", "all_inclusive")
    search_fields = ("post__title", "post__user__user__email")
    autocomplete_fields = ("post",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(BookingPost)
class BookingPostAdmin(admin.ModelAdmin):
    list_display = (
        "post",
        "rent_per_night",
        "maximum_guests",
        "available_indefinitely",
        "available_from",
        "available_until",
    )
    list_filter = ("available_indefinitely",)
    search_fields = ("post__title", "post__user__user__email")
    autocomplete_fields = ("post",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(SavedPost)
class SavedPostAdmin(admin.ModelAdmin):
    list_display = ("user", "post", "created_at")
    search_fields = ("user__user__email", "post__title")
    autocomplete_fields = ("user", "post")
    readonly_fields = ("created_at",)


@admin.register(Rentals)
class RentalsAdmin(admin.ModelAdmin):
    list_display = ("rent_post", "user", "start_date", "end_date", "created_at")
    list_filter = ("start_date", "end_date")
    search_fields = ("rent_post__post__title", "user__user__email")
    autocomplete_fields = ("rent_post", "user")
    readonly_fields = ("created_at", "updated_at")


@admin.register(PostConversation)
class PostConversationAdmin(admin.ModelAdmin):
    list_display = ("post", "user", "last_message", "created_at", "updated_at")
    search_fields = ("post__title", "user__user__email")
    autocomplete_fields = ("post", "user", "last_message")
    readonly_fields = ("created_at", "updated_at")


@admin.register(PostMessage)
class PostMessageAdmin(admin.ModelAdmin):
    list_display = ("conversation", "sender", "created_at")
    search_fields = ("content", "conversation__post__title", "sender__user__email")
    autocomplete_fields = ("conversation", "sender")
    readonly_fields = ("created_at", "updated_at")
