import { StudentItem } from "@/types/student";
import { MOCK_STUDENTS } from "@/data/mockStudentData";

const STORAGE_KEY = "edupro_students_list";

export const getStoredStudents = (): StudentItem[] => {
  if (typeof window === "undefined") {
    return MOCK_STUDENTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
      return MOCK_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return MOCK_STUDENTS;
  } catch {
    return MOCK_STUDENTS;
  }
};

export const saveNewStudent = (newStudent: StudentItem): StudentItem[] => {
  if (typeof window === "undefined") return [newStudent, ...MOCK_STUDENTS];

  try {
    const existing = getStoredStudents();
    const updated = [newStudent, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("edupro_students_updated"));
    return updated;
  } catch {
    return [newStudent, ...MOCK_STUDENTS];
  }
};

export const updateStoredStudent = (
  studentId: string,
  updatedData: Partial<StudentItem>
): StudentItem[] => {
  if (typeof window === "undefined") return MOCK_STUDENTS;

  try {
    const existing = getStoredStudents();
    const updated = existing.map((s) =>
      s.id === studentId ? { ...s, ...updatedData } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("edupro_students_updated"));
    return updated;
  } catch {
    return MOCK_STUDENTS;
  }
};

export const deleteStoredStudent = (studentId: string): StudentItem[] => {
  if (typeof window === "undefined") return MOCK_STUDENTS;

  try {
    const existing = getStoredStudents();
    const updated = existing.filter((s) => s.id !== studentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("edupro_students_updated"));
    return updated;
  } catch {
    return MOCK_STUDENTS;
  }
};

export const saveStoredStudents = (students: StudentItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    window.dispatchEvent(new Event("edupro_students_updated"));
  } catch {}
};
