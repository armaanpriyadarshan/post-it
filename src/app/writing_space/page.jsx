import React from "react";
import Tiptap from "@/components/Tiptap";

export default function WritingSpace() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <Tiptap />
      </div>
    </div>
  );
}
