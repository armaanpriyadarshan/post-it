import { AiOutlineInfo, AiOutlineEdit } from "react-icons/ai";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 right-0 m-6 flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--cafeBrown)] text-[var(--cream)] hover:bg-[var(--darkGreen)] transition cursor-pointer">
                <AiOutlineInfo size={24} />
                <AiOutlineEdit size={24} />
            </div>
        </footer>
    );
}