"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import "../app/styles/tiptap_styles.css";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import React from "react";

const Tiptap = () => {
  const MenuBar = ({ editor }) => {
    if (!editor) {
      return null;
    }

    const buttonClasses = (isActive) =>
      `px-3 py-1 mr-2 rounded focus:outline-none
   ${
     isActive
       ? "bg-blue-500 text-white"
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
    ],
    content: "<p>Start writing your story here ✍️</p>",
    immediatelyRender: false,
    autofocus: true,

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
      // Handle the submission logic here
    }
  };

  return (
    <div className="w-full p-4 border border-gray-300 rounded-lg bg-white">
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
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Tiptap;
