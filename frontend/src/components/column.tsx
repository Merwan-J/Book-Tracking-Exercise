"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddBook from "./addBook";
import Book from "./book";
import { IoMdAdd } from "react-icons/io";
import { Button } from "./ui/button";
import { BookEntry } from "@/app/types/bookEntry";
interface ColumnProps {
    title: string;
    value: "completed" | "to-read" | "reading";
    books: BookEntry[];
}

const Column: React.FC<ColumnProps> = ({ title, value, books }) => {
    const [isAdding, setIsAdding] = React.useState(false);
    const options = {
        "to-read": "Move to 'to read'",
        reading: "Move to 'reading'",
        completed: "Move to 'completed'",
    };

    const filteredOptions = Object.values(options).filter(
        (_, index) => Object.keys(options)[index] !== value
    );

    return (
        <Card className="w-full lg:w-1/3 border-gray-400">
            <CardHeader className="border-b-2 border-gray-800 dark:border-gray-300 ">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-26rem)] mb-3">
                    {/* <div className="flex justify-center items-center h-[calc(100vh-20rem)] text-gray-400 dark:text-gray-600">
                        No books here
                    </div> */}
                    {books.map((book: BookEntry) => (
                        <Book
                            key={book.id}
                            book={book}
                            options={filteredOptions}
                        />
                    ))}

                    {/* {books[status].map((book: BookType) => (
              <Book key={book.id} book={book} action={action} />
            ))}
            {books[status].length === 0 && (
              <div className="flex justify-center items-center h-[calc(100vh-20rem)] text-gray-400 dark:text-gray-600">
                No books here
              </div>
            )} */}
                </ScrollArea>
                {!isAdding && (
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="dark:text-white">
                        <IoMdAdd className="h-4 w-4" /> <p>Add a book</p>
                    </Button>
                )}
                {isAdding && (
                    <AddBook setIsAdding={setIsAdding} value={value} />
                )}
            </CardContent>
        </Card>
    );
};

export default Column;
