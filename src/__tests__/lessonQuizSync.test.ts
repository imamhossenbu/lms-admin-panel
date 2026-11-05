import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn() }));
vi.mock("@/lib/api", () => ({ apiClient: api }));

import { loadLessonQuiz, saveLessonQuiz } from "@/components/courses/create/lesson/quiz/quizSync";
import type { LessonQuiz } from "@/validations/lessonFormSchema";

const quiz: LessonQuiz = {
  id: "",
  timeLimitMinutes: 15,
  passingScore: 60,
  questions: [
    { id: "", questionText: "2 + 2 = ?", questionType: "MCQ", options: ["3", "4", "5"], correctAnswer: "4", marks: 2, explanation: "Basic <maths>" },
    { id: "", questionText: "The sky is blue", questionType: "TRUE_FALSE", options: ["True", "False"], correctAnswer: "True", marks: 3, explanation: "" },
  ],
};

beforeEach(() => {
  api.get.mockReset();
  api.post.mockReset();
  api.patch.mockReset();
});

describe("lesson quiz ↔ /admin/quizzes", () => {
  it("creates a published quiz attached to the lesson in the admin shape", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    await saveLessonQuiz({ courseId: "c1", lessonId: "l1", title: "Arithmetic", quiz });
    expect(api.get).toHaveBeenCalledWith("/admin/quizzes", { params: { lessonId: "l1", limit: 1 } });
    const [url, body] = api.post.mock.calls[0];
    expect(url).toBe("/admin/quizzes");
    expect(body).toMatchObject({ courseId: "c1", lessonId: "l1", title: "Arithmetic", status: "PUBLISHED", timeLimitMinutes: 15, maxAttempts: "UNLIMITED" });
    // 60% of 5 marks → 3
    expect(body.passingMarks).toBe(3);
    expect(body.descriptionHtml).toBe('<p>Quiz for the lesson "Arithmetic".</p>');
    expect(body.questions[0]).toMatchObject({ kind: "MULTIPLE_CHOICE", questionHtml: "<p>2 + 2 = ?</p>", correctOptionIds: ["b"], points: 2, explanationHtml: "<p>Basic &lt;maths&gt;</p>" });
    expect(body.questions[0].options).toEqual([{ id: "a", text: "3" }, { id: "b", text: "4" }, { id: "c", text: "5" }]);
    expect(body.questions[1]).toMatchObject({ kind: "TRUE_FALSE", correctOptionIds: ["a"], points: 3 });
  });

  it("updates the lesson's existing quiz and drafts it when every question is removed", async () => {
    api.get.mockResolvedValue({ data: { data: [{ id: "z9" }] } });
    await saveLessonQuiz({ courseId: "c1", lessonId: "l1", title: "Arithmetic", quiz: { ...quiz, questions: [] } });
    expect(api.post).not.toHaveBeenCalled();
    expect(api.patch.mock.calls[0][0]).toBe("/admin/quizzes/z9");
    expect(api.patch.mock.calls[0][1]).toMatchObject({ status: "DRAFT", questions: [] });
  });

  it("does nothing for a lesson without questions and without a quiz", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    await saveLessonQuiz({ courseId: "c1", lessonId: "l1", title: "Arithmetic", quiz: { ...quiz, questions: [] } });
    expect(api.post).not.toHaveBeenCalled();
    expect(api.patch).not.toHaveBeenCalled();
  });

  it("loads the lesson's quiz back into the form shape", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            id: "z9",
            timeLimitMinutes: 20,
            passingMarks: 3,
            questions: [
              { id: "q1", kind: "MULTIPLE_CHOICE", questionHtml: "<p>2 &amp; 2</p>", options: [{ id: "a", text: "3" }, { id: "b", text: "4" }], correctOptionIds: ["b"], explanationHtml: "", points: 2 },
              { id: "q2", kind: "TRUE_FALSE", questionHtml: "<p>Sky</p>", options: [{ id: "a", text: "True" }, { id: "b", text: "False" }], correctOptionIds: ["a"], explanationHtml: "<p>Yes</p>", points: 2 },
            ],
          },
        ],
      },
    });
    const loaded = await loadLessonQuiz("l1");
    expect(loaded).toMatchObject({ id: "z9", timeLimitMinutes: 20, passingScore: 75 });
    expect(loaded?.questions[0]).toMatchObject({ id: "q1", questionText: "2 & 2", questionType: "MCQ", options: ["3", "4"], correctAnswer: "4", marks: 2 });
    expect(loaded?.questions[1]).toMatchObject({ questionType: "TRUE_FALSE", correctAnswer: "True", explanation: "Yes" });
  });

  it("resolves null when the lesson has no quiz", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    expect(await loadLessonQuiz("l1")).toBeNull();
  });
});
