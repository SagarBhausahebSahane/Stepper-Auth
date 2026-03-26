import { z } from "zod";

export const step1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
});

export const step2Schema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be at least 4 characters")
      .regex(/^[a-z0-9_]+$/, "Username: lowercase, numbers, underscores only"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(["admin", "editor", "viewer"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const step3Schema = z.object({
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(200, "Bio cannot exceed 200 characters"),
  website: z
    .string()
    .url("Enter a valid URL (include https://)")
    .optional()
    .or(z.literal("")),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
  profileImage: z
    .any()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= 2 * 1024 * 1024,
      "Image must be smaller than 2MB"
    )
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
