import { z } from "zod";

export const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Invalid email address"),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"], {
    message: "Role must be STUDENT, TEACHER, or ADMIN",
  }),
  status: z.enum(["ACTIVE", "BLOCKED", "PENDING"], {
    message: "Status must be ACTIVE, BLOCKED, or PENDING",
  }),
  phone: z.string().optional(),
});

export type EditUserInput = z.infer<typeof editUserSchema>;
