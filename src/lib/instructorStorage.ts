import { InstructorItem, InstructorNoteItem } from "@/types/instructor";
import { MOCK_INSTRUCTORS } from "@/data/mockInstructorData";

const STORAGE_KEY = "edupro_instructors_list";
export const INSTRUCTORS_UPDATED_EVENT = "edupro_instructors_updated";

export const getStoredInstructors = (): InstructorItem[] => {
  if (typeof window === "undefined") {
    return MOCK_INSTRUCTORS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INSTRUCTORS));
      return MOCK_INSTRUCTORS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : MOCK_INSTRUCTORS;
  } catch {
    return MOCK_INSTRUCTORS;
  }
};

const persist = (instructors: InstructorItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(instructors));
  window.dispatchEvent(new Event(INSTRUCTORS_UPDATED_EVENT));
};

export const saveNewInstructor = (instructor: InstructorItem): void => {
  if (typeof window === "undefined") return;
  try {
    persist([instructor, ...getStoredInstructors()]);
  } catch {}
};

export const updateStoredInstructor = (
  instructorId: string,
  updatedData: Partial<InstructorItem>
): void => {
  if (typeof window === "undefined") return;
  try {
    persist(
      getStoredInstructors().map((i) =>
        i.id === instructorId ? { ...i, ...updatedData } : i
      )
    );
  } catch {}
};

export const deleteStoredInstructor = (instructorId: string): void => {
  if (typeof window === "undefined") return;
  try {
    persist(getStoredInstructors().filter((i) => i.id !== instructorId));
  } catch {}
};

// ---------------------------------------------------------------------------
// Internal admin notes (stored per instructor)
// ---------------------------------------------------------------------------

const NOTES_STORAGE_KEY = "edupro_instructor_notes";
export const INSTRUCTOR_NOTES_UPDATED_EVENT = "edupro_instructor_notes_updated";

type NotesMap = Record<string, InstructorNoteItem[]>;

const seedNotes = (instructorId: string): InstructorNoteItem[] => [
  {
    id: `${instructorId}-note-1`,
    instructorId,
    title: "Quarterly performance review",
    content:
      "<p>Great instructor. Very responsive and supportive with students. Always delivers high quality content on time.</p>",
    type: "Performance",
    priority: "Low",
    tags: ["Performance", "Positive"],
    author: { name: "Admin", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" },
    createdAt: "2026-10-20T10:30:00",
  },
  {
    id: `${instructorId}-note-2`,
    instructorId,
    title: "JavaScript course refresh",
    content:
      "<p>Requested to update the JavaScript course content with new ES2024 features. Instructor agreed and will update by end of this month.</p>",
    type: "Content Update",
    priority: "High",
    tags: ["Content Update", "Action Required"],
    reminderDate: "2026-10-31",
    author: { name: "Sarah Khan", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" },
    createdAt: "2026-10-15T14:45:00",
  },
  {
    id: `${instructorId}-note-3`,
    instructorId,
    title: "Onboarding completed",
    content:
      "<p>Initial onboarding completed. Provided platform access and guidelines. Instructor is ready to start classes.</p>",
    type: "Onboarding",
    priority: "Medium",
    tags: ["Onboarding", "Completed"],
    author: { name: "Michael Lee", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
    createdAt: "2026-10-12T11:20:00",
  },
];

const readNotesMap = (): NotesMap => {
  try {
    const parsed = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeNotesMap = (map: NotesMap) => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(INSTRUCTOR_NOTES_UPDATED_EVENT));
};

/** Notes for one instructor, newest first. Seeds demo notes on first access. */
export const getInstructorNotes = (instructorId: string): InstructorNoteItem[] => {
  if (typeof window === "undefined") return [];
  const map = readNotesMap();
  if (!map[instructorId]) {
    map[instructorId] = seedNotes(instructorId);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(map));
    } catch {}
  }
  return [...map[instructorId]].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

/** Inserts a new note or replaces an existing one with the same id. */
export const saveInstructorNote = (note: InstructorNoteItem): void => {
  if (typeof window === "undefined") return;
  const map = readNotesMap();
  const current = map[note.instructorId] ?? getInstructorNotes(note.instructorId);
  const exists = current.some((n) => n.id === note.id);
  map[note.instructorId] = exists
    ? current.map((n) => (n.id === note.id ? note : n))
    : [note, ...current];
  writeNotesMap(map);
};

export const deleteInstructorNote = (instructorId: string, noteId: string): void => {
  if (typeof window === "undefined") return;
  const map = readNotesMap();
  map[instructorId] = (map[instructorId] ?? []).filter((n) => n.id !== noteId);
  writeNotesMap(map);
};
