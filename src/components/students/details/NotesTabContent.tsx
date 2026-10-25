"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  StickyNote,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit2,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { PrimaryButton } from "@/components/ui/primary-button";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { NoteCardBlock } from "./NoteCardBlock";
import { AddEditNoteModal } from "./AddEditNoteModal";
import { StudentNoteItem } from "./mockStudentDetails";
import toast from "react-hot-toast";

interface NotesTabContentProps {
  notes?: StudentNoteItem[];
}

export function NotesTabContent({
  notes: initialNotes = [],
}: NotesTabContentProps) {
  const [notes, setNotes] = useState<StudentNoteItem[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<StudentNoteItem | null>(null);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        n.categoryLabel.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.author.name.toLowerCase().includes(q) ||
        n.author.role.toLowerCase().includes(q)
      );
    });
  }, [notes, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: StudentNoteItem) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    toast.success("Note removed successfully.");
  };

  const handleSaveNote = (noteData: {
    category: any;
    categoryLabel: string;
    content: string;
  }) => {
    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? {
                ...n,
                category: noteData.category,
                categoryLabel: noteData.categoryLabel,
                content: noteData.content,
              }
            : n
        )
      );
    } else {
      const newNote: StudentNoteItem = {
        id: `note-${Date.now()}`,
        orderNumber: notes.length + 1,
        category: noteData.category,
        categoryLabel: noteData.categoryLabel,
        content: noteData.content,
        author: {
          name: "Admin",
          role: "Super Admin",
          avatarUrl:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
        },
        date: "Oct 25, 2026",
        time: "04:30 PM",
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const columns: ColumnDef<StudentNoteItem>[] = [
    {
      key: "number",
      header: "#",
      width: "48px",
      align: "center",
      render: (row) => (
        <span className="body-xsm-medium text-primary-300">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: "note",
      header: "Note",
      render: (row) => <NoteCardBlock note={row} />,
    },
    {
      key: "addedBy",
      header: "Added By",
      width: "180px",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-dash bg-slate-100">
            <Image
              src={row.author.avatarUrl}
              alt={row.author.name}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="space-y-0.5 whitespace-nowrap">
            <div className="body-sm-medium font-semibold text-primary-500">
              {row.author.name}
            </div>
            <div className="body-2xsm-regular text-primary-300">
              {row.author.role}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "createdOn",
      header: "Created On",
      width: "140px",
      render: (row) => (
        <div className="space-y-0.5 whitespace-nowrap">
          <div className="body-sm-medium font-semibold text-primary-500">
            {row.date}
          </div>
          <div className="body-2xsm-regular text-primary-300">
            {row.time}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "120px",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenEditModal(row)}
            className="px-3 py-1.5 rounded-lg border border-dash bg-white text-blue hover:bg-blue-14 hover:border-blue/30 body-sm-medium font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            Edit
          </button>

          <AppDropdownMenu
            trigger={
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                title="More actions"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
            items={[
              {
                key: "view-note",
                label: "View Full Note",
                icon: <Eye className="w-3.5 h-3.5 text-primary-400" />,
                onClick: () =>
                  toast(`[${row.categoryLabel}] ${row.content}`, {
                    icon: "📝",
                  }),
              },
              {
                key: "edit-note",
                label: "Edit Note",
                icon: <Edit2 className="w-3.5 h-3.5 text-primary-400" />,
                onClick: () => handleOpenEditModal(row),
              },
              {
                key: "copy-content",
                label: "Copy Text",
                icon: <Copy className="w-3.5 h-3.5 text-primary-400" />,
                onClick: () => {
                  navigator.clipboard.writeText(row.content);
                  toast.success("Note content copied to clipboard!");
                },
              },
              {
                key: "delete-note",
                label: "Delete Note",
                icon: <Trash2 className="w-3.5 h-3.5" />,
                danger: true,
                separatorBefore: true,
                onClick: () => handleDeleteNote(row.id),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Header and Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="title-medium font-bold text-primary-500">
              Notes
            </h2>
            <p className="body-sm-regular text-primary-300">
              Internal notes about this student (visible only to admins).
            </p>
          </div>
        </div>

        {/* Right Toolbar: Search + Add Note Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <div className="relative w-56 sm:w-64">
            <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          <PrimaryButton
            size="md"
            type="button"
            onClick={handleOpenAddModal}
            icon={<Plus className="w-4 h-4 stroke-[2.2]" />}
          >
            Add Note
          </PrimaryButton>
        </div>
      </div>

      {/* DataTable with Column-wise Borders */}
      <div className="rounded-lg border border-dash overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredNotes}
          verticalBorders={true}
          tableClassName="border-collapse"
        />
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="body-sm-regular text-primary-300">
          Showing {filteredNotes.length} of {notes.length} notes
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed hover:bg-slate-50 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-blue text-white flex items-center justify-center body-sm-medium font-bold shadow-2xs"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed hover:bg-slate-50 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add / Edit Note Modal */}
      <AddEditNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        initialNote={editingNote}
      />
    </div>
  );
}
