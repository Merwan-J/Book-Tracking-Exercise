import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FiMoreVertical } from "react-icons/fi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import axios from "axios";
import { BookEntry } from "@/app/types/bookEntry";
import useBooksStore from "@/app/zustand/book-entries";
import { toast } from "./ui/use-toast";

interface BookPropsInterface {
    options: string[];
    book: BookEntry;
}
interface OptionsMap {
    [key: string]: "completed" | "to-read" | "reading";
}

const Book: React.FC<BookPropsInterface> = ({ options, book }) => {
    const optionsMap: OptionsMap = {
        "Move to 'to read'": "to-read",
        "Move to 'reading'": "reading",
        "Move to 'completed'": "completed",
    };

    const bookStore = useBooksStore();

    const handleDelete = async () => {
        try {
            const book_id = book.id;
            const response = await axios.delete(
                `http://127.0.0.1:8000/book-entries/${book_id}/`
            );
            bookStore.removeBook(book_id);

            toast({
                title: "Book deleted",
                variant: "default",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Error deleting book",
                variant: "destructive",
            });
        }
    };

    const handleStatusChange = async (
        new_status: "completed" | "to-read" | "reading"
    ) => {
        try {
            const book_id = book.id;
            const response = await axios.put(
                `http://127.0.0.1:8000/book-entries/${book_id}`,
                {
                    new_status: new_status,
                }
            );
            bookStore.updateBookStatus(book_id, new_status);

            toast({
                title: "Status updated",
                variant: "default",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Error updating status",
                variant: "destructive",
            });
        }
    };
    return (
        <div className="flex justify-between w-full h-[50px] mb-3 first:mt-3 last:mb-0 p-3 dark:bg-[#595958] bg-slate-400 rounded-lg ">
            <p>{book.title}</p>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button>
                        <FiMoreVertical className="hover:cursor-pointer" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        {options.map((item: string) => (
                            <DropdownMenuItem key={item}>
                                <span
                                    className="cursor-pointer "
                                    onClick={() =>
                                        handleStatusChange(
                                            optionsMap[item] as
                                                | "completed"
                                                | "to-read"
                                                | "reading"
                                        )
                                    }>
                                    {item}
                                </span>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <span
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDelete()}>
                                Delete
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default Book;
