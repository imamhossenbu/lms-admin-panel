import { describe, it, expect } from "vitest";
import { editUserSchema } from "../validations/userSchema";
import { createCourseSchema } from "../validations/courseSchema";
import { settingsSchema } from "../validations/settingsSchema";
import { loginSchema } from "../validations/authSchema";

describe("Validation Schemas", () => {
  it("should validate correct user input", () => {
    const validUser = {
      name: "Tariqul Islam",
      email: "tariq@example.com",
      role: "STUDENT" as const,
      status: "ACTIVE" as const,
    };
    const result = editUserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email in user schema", () => {
    const invalidUser = {
      name: "Tariqul",
      email: "not-an-email",
      role: "STUDENT" as const,
      status: "ACTIVE" as const,
    };
    const result = editUserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it("should validate correct login input", () => {
    const validLogin = {
      email: "admin@lms.com",
      password: "admin123",
      rememberMe: true,
    };
    const result = loginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
  });

  it("should reject short password or invalid email in login schema", () => {
    const invalidLogin = {
      email: "bad-email",
      password: "123",
      rememberMe: false,
    };
    const result = loginSchema.safeParse(invalidLogin);
    expect(result.success).toBe(false);
  });

  it("should validate correct course input", () => {
    const validCourse = {
      title: "Advanced TypeScript",
      slug: "advanced-typescript",
      description: "Comprehensive guide to type engineering and utility types.",
      categoryId: "cat-dev",
      level: "ADVANCED" as const,
      price: 49.99,
      isFree: false,
      status: "DRAFT" as const,
    };
    const result = createCourseSchema.safeParse(validCourse);
    expect(result.success).toBe(true);
  });

  it("should reject negative price in course schema", () => {
    const invalidCourse = {
      title: "Course",
      slug: "course",
      description: "Description test",
      categoryId: "cat-1",
      level: "BEGINNER" as const,
      price: -10,
      isFree: false,
      status: "DRAFT" as const,
    };
    const result = createCourseSchema.safeParse(invalidCourse);
    expect(result.success).toBe(false);
  });

  it("should validate hex color in settings schema", () => {
    const validSettings = {
      siteName: "LMS AI",
      supportEmail: "help@lms.com",
      primaryColor: "#1C4D8D",
      secondaryColor: "#4988C4",
      maintenanceMode: false,
    };
    const result = settingsSchema.safeParse(validSettings);
    expect(result.success).toBe(true);
  });
});

