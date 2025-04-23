import { z } from "zod";

const baseUserSchema = z.object({
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

  firstName: z
    .string()
    .min(3, { message: "Invalid Firstname, must be at least 3 characters" })
    .max(25, { message: "Firstname must not exceed 25 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Firstname must contain only letters and spaces",
    }),
  lastName: z
    .string()
    .min(3, { message: "Invalid Lastname, must be at least 3 characters" })
    .max(25, { message: "Lastname must not exceed 25 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Lastname must contain only letters and spaces",
    }),
  dateOfBirth: z.preprocess(
    (value) =>
      value === null || value === "" ? null : new Date(value as string),
    z.union([z.date(), z.null()]).refine(
      (birthDate) => {
        if (!birthDate) return true;

        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const isBirthdayPassed =
          today.getMonth() > birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() >= birthDate.getDate());

        return age > 13 || (age === 13 && isBirthdayPassed);
      },
      { message: "User must be at least 13 years old" }
    )
  ),
});

const createUserSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().optional(),
    roleId: z.string({ message: "Please select a role" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Helper function for password validation
const isConfirmPasswordValid = (data: {
  password?: string;
  confirmPassword?: string;
}) => {
  if (!data.password) return true;
  return data.password === data.confirmPassword;
};

const updateUserSchema = baseUserSchema
  .extend({
    setManualPassword: z.boolean().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    roleId: z.string({ message: "Please select a role" }),
  })
  .superRefine((data, ctx) => {
    if (data.setManualPassword) {
      if (!data.password || data.password.length < 8) {
        ctx.addIssue({
          path: ["password"],
          message: "Password must be at least 8 characters long",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Passwords do not match",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
export { baseUserSchema, createUserSchema, updateUserSchema };
