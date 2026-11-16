from django.core.exceptions import ValidationError
from django.db import models


class PostConversation(models.Model):
    user = models.ForeignKey(
        "users.AppUser",
        on_delete=models.CASCADE,
        related_name="conversations",
    )
    post = models.ForeignKey(
        "posts.Post",
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="conversations",
    )

    last_message = models.ForeignKey(
        "PostMessage",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="last_message_conversations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Post Conversation"
        verbose_name_plural = "Post Conversations"
        constraints = (
            models.UniqueConstraint(
                fields=["post", "user"],
                name="unique_post_conversation_user",
            ),
        )
        indexes = (
            models.Index(fields=["user"]),
            models.Index(fields=["post"]),
        )
        ordering = ("-updated_at",)

    def clean(self):
        super().clean()
        if (
            self.user_id is not None
            and self.post_id is not None
            and self.user_id == self.post.user_id
        ):
            raise ValidationError(
                {"user": "The post creator cannot start a conversation with themselves."}
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class PostMessage(models.Model):
    conversation = models.ForeignKey(
        PostConversation, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        "users.AppUser", on_delete=models.CASCADE, related_name="sent_messages"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Post Message"
        verbose_name_plural = "Post Messages"
        indexes = (
            models.Index(fields=["conversation"]),
            models.Index(fields=["sender"]),
        )
        ordering = ("created_at",)
