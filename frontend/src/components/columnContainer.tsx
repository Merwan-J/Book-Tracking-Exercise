"use client";
import { BookEntry } from "@/app/types/bookEntry";
import Column from "./column";
import React, { useEffect, useState } from "react";

interface ColumnContainerProps {
    books: BookEntry[];
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({ books }) => {
    const completedBooks = books.filter((book) => book.status === "completed");
    const toReadBooks = books.filter((book) => book.status === "to-read");
    const inProgressBooks = books.filter((book) => book.status === "reading");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);
    return (
        <div className="flex lg:flex-row flex-col items-start gap-3 md:gap-10 md:p-5 w-4/5 md:w-2/3 h-full">
            <Column title="To Read" value="to-read" books={toReadBooks} />
            <Column title="Reading" value="reading" books={inProgressBooks} />
            <Column
                title="Completed"
                value="completed"
                books={completedBooks}
            />
        </div>
    );
};

export default ColumnContainer;
