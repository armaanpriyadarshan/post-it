import { AiOutlineLogout } from "react-icons/ai";

export default function Logout() {
    return (
        <div className="flex items-center justify-center mt-2 rounded-full hover:underline">
            bye! <span className="w-3"></span><AiOutlineLogout size={24} />
        </div>
    );
}