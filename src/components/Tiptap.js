"use client";

import { IBM_Plex_Mono } from "next/font/google";
import { useEditor, EditorContent } from "@tiptap/react";
import "../app/styles/tiptap_styles.scss";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// apply custom Google font to the editor container
const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Tiptap = ({ onUpdate, title, author }) => {
  const router = useRouter();

  const MenuBar = ({ editor }) => {
    if (!editor) {
      return null;
    }

    const buttonClasses = (isActive) =>
      `px-3 py-1 mr-2 rounded focus:outline-none
   ${
     isActive
       ? "bg-[var(--darkGreen)] text-white"
       : "bg-gray-200 text-gray-800 hover:bg-gray-300"
   }`;

    return (
      <div className="control-group">
        <div className="button-group">
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={buttonClasses(editor.isActive("heading", { level: 1 }))}
          >
            H1
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={buttonClasses(editor.isActive("heading", { level: 2 }))}
          >
            H2
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={buttonClasses(editor.isActive("heading", { level: 3 }))}
          >
            H3
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().setParagraph().run();
            }}
            className={buttonClasses(editor.isActive("paragraph"))}
          >
            Paragraph
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={buttonClasses(editor.isActive("bold"))}
          >
            Bold
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={buttonClasses(editor.isActive("italic"))}
          >
            Italic
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            className={buttonClasses(editor.isActive("strike"))}
          >
            Strike
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            className={buttonClasses(editor.isActive("underline"))}
          >
            Underline
          </button>

          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().toggleHighlight().run();
            }}
            className={buttonClasses(editor.isActive("highlight"))}
          >
            Highlight
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().setTextAlign("left").run();
            }}
            className={buttonClasses(editor.isActive({ textAlign: "left" }))}
          >
            Left
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().setTextAlign("center").run();
            }}
            className={buttonClasses(editor.isActive({ textAlign: "center" }))}
          >
            Center
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().setTextAlign("right").run();
            }}
            className={buttonClasses(editor.isActive({ textAlign: "right" }))}
          >
            Right
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              editor.chain().focus().setTextAlign("justify").run();
            }}
            className={buttonClasses(editor.isActive({ textAlign: "justify" }))}
          >
            Justify
          </button>
        </div>
      </div>
    );
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Underline,
      Blockquote,
      HorizontalRule,
      CharacterCount.configure({
        limit: 10000, // optional: 10k characters max
      }),
      Placeholder.configure({
        placeholder: "Start writing your story here ✍️",
        showOnlyWhenEditable: true,
        showOnlyWhenEmpty: true,
        emptyEditorClass: "is-editor-empty is-empty",
      }),
    ],
    immediatelyRender: false,
    autofocus: false,
    onUpdate,

    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none text-black",
      },
    },
  });

  const submitButton = () => {
    if (editor) {
      const content = editor.getHTML();
      console.log("Submitted content:", content);
      console.log("Title:", title);
      console.log("Author:", author);
      supabase
        .from("notes")
        .insert([
          {
            story: content,
            title: title ? title : "",
            author: author ? author : "",
          },
        ])
        .then(({ data, error }) => {
          if (error) {
            console.error("Error inserting note:", error);
            // TODO: show error message to user
          } else {
            console.log("Note added");
            editor.commands.clearContent();
            router.push("/");
          }
        });
    }
  };

  return (
    <div
      className={`${ibmMono.className} w-full p-4 border border-gray-300 rounded-lg bg-white`}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex justify-between items-center mt-2">
        {editor && (
          <div className="text-sm text-gray-500">
            {editor.storage.characterCount.characters()} characters
          </div>
        )}
        <button
          type="button"
          onClick={submitButton}
          className="px-4 py-2 bg-[var(--darkGreen)] text-white rounded-lg hover:bg-[color:var(--darkGreen)]/80 focus:outline-none focus:ring-2 focus:ring-[color:var(--lightGreen)] focus:ring-opacity-50"
        >
          Post It!
        </button>
      </div>
    </div>
  );
};

export default Tiptap;
