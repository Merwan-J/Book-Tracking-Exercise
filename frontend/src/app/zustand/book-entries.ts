import { create } from "zustand";
import { BookEntry } from "../types/bookEntry";

type BooksState = {
    books: BookEntry[];
    addBook: (book: BookEntry) => void;
    setBooks: (books: BookEntry[]) => void;
    updateBookStatus: (
        id: number,
        new_status: "completed" | "to-read" | "reading"
    ) => void;
    removeBook: (id: number) => void;
};

const useBooksStore = create<BooksState>((set) => ({
    books: [],
    setBooks: (books: BookEntry[]) => set(() => ({ books })),
    addBook: (book) => set((state) => ({ books: [book, ...state.books] })),
    updateBookStatus: (id: number, newStatus) => {
        set((state) => {
            const book = state.books.find((book) => book.id === id);
            if (book) {
                book.status = newStatus;
            }
            return { books: [...state.books] };
        });
    },
    removeBook: (id) =>
        set((state) => ({
            books: state.books.filter((book) => book.id !== id),
        })),
}));

export default useBooksStore;
