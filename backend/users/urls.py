from django.urls import path

from .views import (
    AppUserRetrieveUpdateView,
    LoginView,
    ProfilePictureUploadView,
    SignUpView,
    TokenRefreshView,
    VerifyEmailView,
)

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path(
        "profile/", AppUserRetrieveUpdateView.as_view(), name="app-user-retrieve-update"
    ),
    path(
        "profile/picture/",
        ProfilePictureUploadView.as_view(),
        name="profile-picture-upload",
    ),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
]
