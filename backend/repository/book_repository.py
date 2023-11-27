import mysql.connector
from typing import List

from models.book import BookEntry


class BookRepository:
    def __init__(self, host: str = "localhost", user: str = "root", password: str = "", database: str = "books"):
        self.connection_params = {
            "host": host,
            "user": user,
            "password": password,
            "port": "3306",
            "database": "books"
        }
        self.create_database(database)
        self.create_table()

    def create_database(self, database: str):
        with mysql.connector.connect(**self.connection_params) as connection:
            cursor = connection.cursor()
            cursor.execute("CREATE DATABASE IF NOT EXISTS {}".format(database))
            connection.commit()
            # self.connection_params["database"] = database

    def create_table(self):
        with mysql.connector.connect(**self.connection_params) as connection:
            cursor = connection.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS book_entries (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255),
                    status VARCHAR(50)
                )
            """)
            connection.commit()

    def clear_test_database(self):
        with mysql.connector.connect(**self.connection_params) as connection:
            cursor = connection.cursor()
            cursor.execute("DELETE FROM book_entries")
            connection.commit()

    def get_all_book_entries(self) -> List[BookEntry]:
        with mysql.connector.connect(**self.connection_params) as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT id, title, status FROM book_entries")
            book_entries = [BookEntry(**row) for row in cursor.fetchall()]
        return book_entries

    def add_book_entry(self, title: str, status: str = "to-read") -> BookEntry:
        with mysql.connector.connect(**self.connection_params) as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("INSERT INTO book_entries (title, status) VALUES (%s, %s)",
                           (title, status))
            connection.commit()
            entry_id = cursor.lastrowid
            return BookEntry(id=entry_id, title=title, status=status)

    def update_book_entry_status(self, entry_id: int, new_status: str,new_title:str) -> BookEntry:
        print("update_book_entry_status",entry_id,new_status,new_title)
        with mysql.connector.connect(**self.connection_params) as connection:
            cursor = connection.cursor(dictionary=True)

            cursor.execute(
                "SELECT * FROM book_entries WHERE id=%s", (entry_id,))
            book_entry = cursor.fetchone()
            title = book_entry['title'] if book_entry else ""
            entry_id = book_entry['id']

            cursor.execute(
                "UPDATE book_entries SET title=%s, status=%s WHERE id=%s", (new_title,new_status, entry_id))
            connection.commit()
            return BookEntry(id=entry_id, title=new_title, status=new_status)

    def delete_book_entry(self, entry_id: int):
        with mysql.connector.connect(**self.connection_params) as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("DELETE FROM book_entries WHERE id=%s", (entry_id,))
            connection.commit()
