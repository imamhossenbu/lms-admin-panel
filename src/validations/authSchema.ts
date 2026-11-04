import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please provide a valid administrative email"),
  password: z
    .string()
    .min(1, "Security password is required")
    .min(6, "Password must contain at least 6 characters"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/** 6-digit authenticator code (OtpInput keeps one digit per box). */
export const twoFactorCodeSchema = z.object({
  digits: z
    .array(z.string())
    .length(6)
    .refine((d) => d.every((x) => /^\d$/.test(x)), "Enter the 6-digit code from your authenticator app"),
});
export type TwoFactorCodeFormData = z.infer<typeof twoFactorCodeSchema>;

/** Accept a team invitation: name + password (same strength rules as the API). */
export const acceptInviteSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters").max(80, "Name must be 80 characters or less"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match" });
export type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;
