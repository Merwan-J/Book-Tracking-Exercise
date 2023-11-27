from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.responses import JSONResponse
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from repository.book_repository import BookRepository
from models.book import BookEntry, BookCreate, BookUpdate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_repository():
    return BookRepository(host="localhost", user="root", password="merwan", database="books")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/book-entries", response_model=List[BookEntry])
def get_book_entries(repository: BookRepository = Depends(get_repository)):
    return repository.get_all_book_entries()


@app.post("/book-entries", response_model=BookEntry)
def add_book_entry(book_data: BookCreate, repository: BookRepository = Depends(get_repository)):
    return repository.add_book_entry(book_data.title, book_data.status)


@app.put("/book-entries/{entry_id}", response_model=BookEntry)
def update_book_entry_status(entry_id: int, book_data: BookUpdate, repository: BookRepository = Depends(get_repository)):
    return repository.update_book_entry_status(entry_id, book_data.new_status, book_data.new_title)


@app.delete("/book-entries/{entry_id}", response_class=JSONResponse)
def delete_book_entry(entry_id: int, repository: BookRepository = Depends(get_repository)):
    repository.delete_book_entry(entry_id)
    return JSONResponse(content={"message": "Book entry deleted successfully"})
