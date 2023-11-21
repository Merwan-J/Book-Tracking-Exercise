"use client";
import ColumnContainer from "@/components/columnContainer";
import { ModeToggle } from "@/components/modeToggle";
import { useEffect, useState } from "react";
import useBooksStore from "./zustand/book-entries";
import { useThemeStore } from "./zustand/theme";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";

const Home = function () {
    const [loading, setLoading] = useState(true);
    const themeStore = useThemeStore();
    const bookStore = useBooksStore();

    const url = "http://127.0.0.1:8000/book-entries";

    const getBooks = async () => {
        const response = await axios.get(url);
        return JSON.stringify(response.data);
    };

    useEffect(() => {
        const cur_theme = localStorage.getItem("theme");
        if (cur_theme === "dark") themeStore.changeTheme("dark");

        setLoading(true);
        getBooks()
            .then((data) => {
                const books = JSON.parse(data);
                bookStore.setBooks(books);
            })
            .catch((err) => {
                toast({
                    title: "ERROR: Can not fetch books",
                    variant: "destructive",
                });
            });
        setLoading(false);
    }, []);

    return (
        <div className="flex flex-col gap-4 pt-3 h-screen bg-gray-100 dark:text-white dark:bg-[#212121]">
            <Toaster />
            <div className="flex items-end justify-end px-6">
                <ModeToggle />
            </div>
            <div className="w-full h-full flex flex-col gap-2 items-center pt-2 dark:text-[#b7b5b0]">
                <h1 className="font-extrabold text-4xl">Book Tracker</h1>
                <ColumnContainer books={bookStore.books} />
            </div>
        </div>
    );
};

export default Home;
