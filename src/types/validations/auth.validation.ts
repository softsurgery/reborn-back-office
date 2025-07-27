import { z } from "zod";

export const connectSchema = z.object({
  usernameOrEmail: z.string().min(3, {
    message: "Invalid Username or E-mail, must be at least 3 characters long",
  }),
  password: z.string().min(8, {
    message: "Invalid Password, must be at least 8 characters long",
  }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Invalid Username, it must contain only letters, numbers, or underscores",
      })
      .min(3, {
        message: "Invalid Username, must be at least 3 characters long",
      }),
    email: z.string().email({ message: "Invalid E-mail" }),
    password: z.string().min(8, {
      message: "Invalid Password, must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
