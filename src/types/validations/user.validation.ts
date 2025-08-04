import { Phone } from "lucide-react";
import { z } from "zod";

// Translation function - this should be passed as a parameter or imported from your i18n setup
// For now, using a placeholder that returns the key

const baseUserSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "userManagement.validation.invalidUsernameFormat",
    })
    .min(3, {
      message: "userManagement.validation.invalidUsernameLength",
    }),
  email: z
    .string()
    .email({ message: "userManagement.validation.invalidEmail" }),

  firstName: z
    .string()
    .min(3, {
      message: "userManagement.validation.invalidFirstNameLength",
    })
    .max(25, {
      message: "userManagement.validation.firstNameTooLong",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "userManagement.validation.invalidFirstNameFormat",
    }),
  lastName: z
    .string()
    .min(3, {
      message: "userManagement.validation.invalidLastNameLength",
    })
    .max(25, { message: "userManagement.validation.lastNameTooLong" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "userManagement.validation.invalidLastNameFormat",
    }),
  dateOfBirth: z
    .preprocess(
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
        { message: "userManagement.validation.invalidAge" }
      )
    )
    .optional(),
});

const createUserSchema = baseUserSchema
  .extend({
    password: z.string().min(8, {
      message: "userManagement.validation.invalidPasswordLength",
    }),
    confirmPassword: z.string().optional(),
    roleId: z.string({
      message: "userManagement.validation.roleRequired",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "userManagement.validation.passwordMismatch",
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

function updateUserSchema(requirePasswordUpdate: boolean) {
  return baseUserSchema
    .extend({
      password: requirePasswordUpdate
        ? z
            .string()
            .min(8, {
              message: "userManagement.validation.invalidPasswordLength",
            })
            .optional()
        : z.string().optional(),
      confirmPassword: z.string().optional(),
      roleId: z.string({
        message: "userManagement.validation.roleRequired",
      }),
    })
    .superRefine((data, ctx) => {
      if (requirePasswordUpdate) {
        if (!data.password || data.password.length < 8) {
          ctx.addIssue({
            path: ["password"],
            message: "userManagement.validation.invalidPasswordLength",
            code: "custom",
          });
        }

        if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            path: ["confirmPassword"],
            message: "userManagement.validation.passwordMismatch",
            code: "custom",
          });
        }
      }
    });
}

const profileSchema = z.object({
  phone: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return phoneRegex.test(value);
    }, {
      message: "userManagement.validation.invalidPhoneFormat",
    }),
  cin: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const cinRegex = /^[A-Z]{1,2}\d{6}$/;
      return cinRegex.test(value);
    }, {
      message: "userManagement.validation.invalidCinFormat",
    }),
  bio: z
    .string()
    .max(500, {
      message: "userManagement.validation.bioTooLong",
    })
    .optional(),
  isPrivate: z.boolean().optional(),
});


export { baseUserSchema, createUserSchema, updateUserSchema, profileSchema };
