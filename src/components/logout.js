import { AiOutlineLogout } from "react-icons/ai";

export default function Logout() {
    return (
        <div className="flex items-center justify-center w-12 h-12 mt-8 rounded-full bg-[var(--cream)] text-[var(--darkBrown)] hover:bg-[var(--cafeBrown)] hover:text-[var(--cream)] hover:border-[var(--darkGreen)] border-2 border-transparent transition-colors duration-300 cursor-pointer">
            <AiOutlineLogout size={24} />
        </div>
    );
}