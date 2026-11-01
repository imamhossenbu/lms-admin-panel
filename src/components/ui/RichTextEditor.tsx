"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  CodeSquare,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Minus,
} from "lucide-react";

export interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  minHeight?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write comprehensive lesson instructions, lecture notes, or exercise steps...",
  label,
  required = false,
  minHeight = "220px",
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "body-sm-medium text-blue underline hover:opacity-80",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `focus:outline-none p-3.5 text-primary-500 body-sm-regular prose prose-sm max-w-none min-h-[${minHeight}]`,
      },
    },
  });

  // Keep content synced if external value changes (e.g. loading a different lesson)
  useEffect(() => {
    if (editor && value !== editor.getHTML() && value !== editor.getText()) {
      // Only set if different to prevent cursor jumps
      if (value !== editor.getHTML()) {
        editor.commands.setContent(value || "");
      }
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block body-sm-regular text-primary-400 mb-2 select-none">
            {label}
            {required && <span className="text-red ml-0.5">*</span>}
          </label>
        )}
        <div
          className="w-full rounded-lg border border-dash bg-white animate-pulse p-4"
          style={{ minHeight }}
        />
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const textLength = editor.getText().length;
  const wordCount = editor.getText().trim()
    ? editor.getText().trim().split(/\s+/).length
    : 0;

  return (
    <div className={`w-full text-left space-y-1.5 ${className}`}>
      {label && (
        <label className="block body-sm-regular text-primary-400 mb-2 select-none">
          {label}
          {required && <span className="text-red ml-0.5">*</span>}
        </label>
      )}

      <div
        className="rounded-lg border border-dash bg-white overflow-hidden transition-all focus-within:border-blue shadow-xs"
      >
        {/* Editor Ribbon Toolbar */}
        <div className="p-1.5 bg-gray-bg border-b border-dash flex items-center gap-1 flex-wrap select-none">
          {/* Headings */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-dash">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Formats */}
          <div className="flex items-center gap-0.5 px-1 border-r border-dash">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("bold")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("italic")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("underline")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("strike")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("code")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Inline Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-0.5 px-1 border-r border-dash">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("bulletList")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("orderedList")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("blockquote")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("codeBlock")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Code Block"
            >
              <CodeSquare className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-md text-primary-400 hover:text-primary-500 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Horizontal Divider"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center gap-0.5 px-1 border-r border-dash">
            <button
              type="button"
              onClick={setLink}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                editor.isActive("link")
                  ? "bg-white text-blue shadow-2xs"
                  : "text-primary-400 hover:text-primary-500 hover:bg-slate-200/60"
              }`}
              title="Add Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            {editor.isActive("link") && (
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="p-1.5 rounded-md text-red hover:bg-red-14 transition-colors cursor-pointer"
                title="Remove Link"
              >
                <Unlink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* History */}
          <div className="flex items-center gap-0.5 pl-1 ml-auto">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="p-1.5 rounded-md text-primary-400 hover:text-primary-500 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="p-1.5 rounded-md text-primary-400 hover:text-primary-500 hover:bg-slate-200/60 disabled:opacity-40 transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Editable Area */}
        <div style={{ minHeight }} className="cursor-text" onClick={() => editor.commands.focus()}>
          <EditorContent editor={editor} />
        </div>

        {/* Word Counter & Format Indicator Footer */}
        <div className="px-3 py-1.5 bg-gray-bg border-t border-dash flex items-center justify-between body-2xsm-regular text-primary-400 select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green inline-block" />
            TipTap Rich Text Engine Active
          </span>
          <span>
            {wordCount} words • {textLength} characters
          </span>
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;
