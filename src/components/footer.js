'use client';

import { useState } from 'react';
import { AiOutlineInfo } from "react-icons/ai";
import { IBM_Plex_Mono } from 'next/font/google';
import Add from "@/components/add";
import Link from "next/link";

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400'],
    display: 'swap',
});

export default function Footer() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <footer className="fixed bottom-6 right-6 flex items-center space-x-6">
            <div className="relative">
                {showInfo && (
                    <div className="absolute bottom-16 right-0 mb-2 p-4 rounded-lg bg-[var(--cafeBrown)] text-[var(--cream)] text-sm shadow-lg animate-smooth-fade-in w-64">
                        <div className={`relative, ${ibmPlexMono.className}`}>
                            welcome to post.it! during your stay, you can peruse the stories left by others, or leave your own sticky note for the next visitor to find.
                            <div className="absolute -bottom-1 right-3 w-3 h-3 bg-[var(--cafeBrown)] rotate-45 transform origin-top-left"></div>
                        </div>
                    </div>
                )}

                <Link href="/writing-space" className="">
                    <Add />
                </Link>
                
                <div onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} className="mt-4 w-12 h-12 flex items-center justify-center rounded-full border-2 border-[var(--cafeBrown)] text-[var(--cafeBrown)] bg-transparent hover:bg-[var(--cafeBrown)] hover:text-[var(--cream)] transition-colors duration-300 cursor-pointer">
                    <AiOutlineInfo size={24} />
                </div>
            </div>
        </footer>
    );
}