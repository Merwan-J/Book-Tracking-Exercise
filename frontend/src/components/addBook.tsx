import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import useBooksStore from "@/app/zustand/book-entries";
import { toast } from "./ui/use-toast";

interface AddBookProps {
    setIsAdding: (isAdding: boolean) => void;
    value: "completed" | "to-read" | "reading";
}

const AddBook: React.FC<AddBookProps> = ({ setIsAdding, value }) => {
    const [title, setTitle] = React.useState("");
    const bookStore = useBooksStore();

    const addBook = async () => {
        try {
            // check if title is empty
            if (!title) {
                alert("Please add a book title");
            }
            const book = { title, status: value };

            const response = await axios.post(
                "http://127.0.0.1:8000/book-entries/",
                book
            );
            bookStore.addBook(response.data);

            // clear the input
            setTitle("");
            setIsAdding(false);

            // show toast
            toast({
                title: "Successfully Added A Book",
            });
        } catch (err) {
            toast({
                title: "ERROR: Can not Add book",
                variant: "destructive",
            });
        }
    };

    const handleTitleChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setTitle(event.target.value);
    };
    return (
        <div className="flex flex-col gap-3">
            <Textarea
                placeholder="Add a book"
                onChange={handleTitleChange}
                value={title}
            />
            <div className="flex items-center justify-start gap-4">
                <Button
                    className="px-4 py-2 rounded-lg"
                    variant="default"
                    onClick={() => addBook()}>
                    Add
                </Button>
                <Button
                    className="w-10"
                    variant="ghost"
                    onClick={() => setIsAdding(false)}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default AddBook;
