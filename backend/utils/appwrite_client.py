import random
import string

from appwrite.client import Client
from appwrite.input_file import InputFile
from appwrite.models import File
from appwrite.services.storage import Storage
from django.conf import settings


class AppwriteClient:
    client: Client
    storage: Storage
    _bucket_id: str = settings.APPWRITE_BUCKET_ID

    def __init__(self):
        self.client = Client()
        self.client.set_project(settings.APPWRITE_PROJECT_ID)
        self.client.set_key(settings.APPWRITE_API_KEY)
        self.client.set_endpoint(settings.APPWRITE_API_ENDPOINT)
        self.storage = Storage(self.client)

    def _generate_file_id(self) -> str:
        characters = string.ascii_letters + string.digits + "-._"
        return "".join(random.choice(characters) for _ in range(20))

    def upload_file(self, file_path: str, folder: str | None = None) -> File:
        input_file = InputFile.from_path(file_path)
        return self.storage.create_file(
            bucket_id=self._bucket_id,
            file=input_file,
            file_id=self._generate_file_id(),
            folder=folder,
        )

    def get_file(self, file_id: str) -> File:
        return self.storage.get_file(bucket_id=self._bucket_id, file_id=file_id)

    def get_file_view(self, file_id: str) -> bytes:
        return self.storage.get_file_view(bucket_id=self._bucket_id, file_id=file_id)

    def delete_file(self, file_id: str) -> None:
        self.storage.delete_file(bucket_id=self._bucket_id, file_id=file_id)
