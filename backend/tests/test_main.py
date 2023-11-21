from main import app
import pytest
from fastapi.testclient import TestClient
from repository.book_repository import BookRepository
import sys
sys.path.append("..")


@pytest.fixture
def test_client():
    return TestClient(app)


@pytest.fixture
def test_repository():
    repository = BookRepository(
        host="localhost", user="root", password="merwan", database="test_books")
    yield repository
    repository.clear_test_database()


def test_get_all_book_entries(test_client, test_repository):
    response = test_client.get("/book-entries")
    assert response.status_code == 200
    assert type(response.json()) == list


def test_add_book_entry(test_client, test_repository):
    response = test_client.post("/book-entries", json={"title": "Test Book"})
    assert response.status_code == 200
    assert response.json()["title"] == "Test Book"
    assert response.json()["status"] == "to-read"
