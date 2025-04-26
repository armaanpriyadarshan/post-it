"use client";

import React from "react";
import Tiptap from "@/components/Tiptap";
import Prompt from "@/components/prompt";
import { useSearchParams } from "next/navigation";

export default function WritingSpace() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full max-w-6xl">
        <Prompt prompt={prompt} />
        <div className="mb-4 flex w-full gap-4 justify-between">
          <input
            type="text"
            placeholder="Enter your title here (optional btw)..."
            className="flex-1 p-2 border border-gray-300 rounded-lg bg-white max-w-md"
          />
          <input
            type="text"
            placeholder="Enter your name here (also optional btw)..."
            className="flex-1 p-2 border border-gray-300 rounded-lg bg-white max-w-xs"
          />
        </div>
        <Tiptap />
      </div>
    </div>
  );
}
