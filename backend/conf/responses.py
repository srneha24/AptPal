from typing import Any

from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

ResponseData = dict[str, Any] | list[Any]


def default_message_for_status(status_code: int) -> str:
    if 200 <= status_code < 300:
        return "Request successful."
    if 400 <= status_code < 500:
        return "The request could not be completed."
    if 500 <= status_code < 600:
        return "An internal server error occurred."
    return "Request completed."


class APIResponse(Response):
    """A DRF response with AptPal's standard API envelope."""

    def __init__(
        self,
        data: ResponseData,
        message: str | None = None,
        success: bool = True,
        status_code: int = status.HTTP_200_OK,
        pagination: dict[str, int | None] | None = None,
        **kwargs: Any,
    ) -> None:
        envelope: dict[str, Any] = {
            "success": success,
            "message": (
                message
                if message is not None
                else default_message_for_status(status_code)
            ),
            "data": data,
        }
        if pagination is not None:
            envelope.update(pagination)

        super().__init__(envelope, status=status_code, **kwargs)


class EnvelopePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data: ResponseData) -> APIResponse:
        page = self.page
        return APIResponse(
            data=data,
            message="Results retrieved successfully.",
            pagination={
                "page": page.number,
                "page_size": page.paginator.per_page,
                "prev_page": (
                    page.previous_page_number() if page.has_previous() else None
                ),
                "next_page": page.next_page_number() if page.has_next() else None,
                "total_items": page.paginator.count,
                "total_pages": page.paginator.num_pages,
            },
        )


def api_exception_handler(exc: Exception, context: dict[str, Any]) -> Response | None:
    """Wrap handled DRF exceptions while preserving their HTTP status codes."""
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    errors = response.data
    if isinstance(errors, dict) and "detail" in errors:
        data = dict(errors)
        detail = data.pop("detail")
        message = (
            " ".join(str(item) for item in detail)
            if isinstance(detail, list)
            else str(detail)
        )
    elif isinstance(errors, dict):
        message = "Validation failed."
        data = errors
    elif isinstance(errors, list):
        message = "Request failed."
        data = errors
    else:
        message = str(errors)
        data = {}

    response.data = {
        "success": False,
        "message": message,
        "data": data,
    }
    return response
