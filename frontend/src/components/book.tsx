import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
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
import { Button } from "./ui/button";

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
    const [title, setTitle] = React.useState("");

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
                    new_title: book.title,
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
    const handleTitleChange = async (new_title: string) => {
        try {
            const book_id = book.id;

            const response = await axios.put(
                `http://127.0.0.1:8000/book-entries/${book_id}`,
                {
                    new_status: book.status,
                    new_title: new_title,
                }
            );

            console.log(response.data);

            bookStore.updateBookTitle(book_id, new_title);

            toast({
                title: "Title updated",
                variant: "default",
            });
        } catch (err) {
            console.log(err);
            toast({
                title: "Error updating Title",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex justify-between w-full h-[50px] mb-3 first:mt-3 last:mb-0 p-3 dark:bg-[#595958] bg-slate-400 rounded-lg ">
            <p>{book.title}</p>
            {book.status != "completed" && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Edit Title</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Title</DialogTitle>
                            <DialogDescription>
                                Make changes to your book title here. Click save
                                when done
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="border border-gray-200 dark:border-gray-800 rounded-lg p-2"
                                defaultValue={book.title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="submit"
                                    onClick={() => handleTitleChange(title)}>
                                    Save changes
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
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
