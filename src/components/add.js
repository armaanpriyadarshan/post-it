import { AiOutlineEdit } from "react-icons/ai";

export default function Add() {
    return (
        <div className="flex items-center justify-center w-12 h-12 mt-8 rounded-full bg-[var(--darkGreen)] text-[var(--cream)] hover:bg-[var(--cream)] hover:text-[var(--darkGreen)] hover:border-[var(--darkGreen)] border-2 border-transparent transition-colors duration-300 cursor-pointer">
            <AiOutlineEdit size={24} />
        </div>
    );
}