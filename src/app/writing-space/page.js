"use client";

import React, { useState, useEffect } from "react";
import Tiptap from "@/components/Tiptap";
import Link from "next/link";
import { IBM_Plex_Mono } from "next/font/google";
import { AiFillCaretLeft } from "react-icons/ai";
import { supabase } from "@/lib/supabaseClient";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function WritingSpace() {
  const [prompt, setPrompt] = useState("Loading...");
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(null);

  const getPrompt = async () => {
    const { data, error } = await supabase
      .from("prompts")
      .select("prompt")
      .gte(
        "created_at",
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      )
      .limit(1);

    if (error) {
      console.error("Error fetching prompt:", error);
    }

    setPrompt(data[0]?.prompt || "No prompt available");
  };

  useEffect(() => {
    getPrompt();
  }, []);

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      if (!user) {
        setUser(session.user);
      }
    } else {
      if (user) {
        setUser(null);
      }
    }
  })

  useEffect(() => {
    const { data, error } = supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
    }
    if (data) {
      setUser(data.user);
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="w-full px-12 max-w-4xl mx-12 mt-12 mx-auto text-center">
        <p className={`text-green ${ibmPlexMono.className} text-xl uppercase`}>
          {prompt}
        </p>
      </div>

      <div className="w-full flex justify-center p-8">
        <div className="flex flex-col w-full max-w-6xl">
          <div
            className={`mb-4 ${ibmPlexMono.className} flex w-full gap-4 justify-between`}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="enter your title here (optional btw)"
              className="flex-1 p-2 border border-gray-300 rounded-lg bg-white max-w-md"
            />
          </div>
          <Tiptap title={title} author={user ? user.user_metadata.full_name.toLowerCase() : ""} />
        </div>
      </div>

      <div className="w-full flex justify-center mt-4">
        <Link
          href="/"
          className={`flex items-center gap-2 text-brown text-xl hover:underline transition-colors duration-300 cursor-pointer ${ibmPlexMono.className}`}
        >
          <AiFillCaretLeft size={18} style={{ transform: "translateY(2px)" }} />
          <span>need ideas?</span>
        </Link>
      </div>
    </div>
  );
}
