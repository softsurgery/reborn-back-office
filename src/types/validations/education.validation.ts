import { z } from "zod";

const baseEducationSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "education.validation.titleTooShort",
    })
    .max(100, {
      message: "education.validation.titleTooLong",
    }),
  institution: z
    .string()
    .min(2, {
      message: "education.validation.institutionTooShort",
    })
    .max(100, {
      message: "education.validation.institutionTooLong",
    }),
  startDate: z
    .preprocess(
      (value) =>
        value === null || value === "" ? null : new Date(value as string),
      z.date({
        message: "education.validation.startDateRequired",
      }),
    )
    .refine(
      (date) => {
        if (!date) return false;
        return date <= new Date();
      },
      {
        message: "education.validation.startDateFuture",
      },
    ),
  endDate: z
    .preprocess(
      (value) =>
        value === null || value === "" ? null : new Date(value as string),
      z.union([z.date(), z.null()]),
    )
    .optional(),
  description: z
    .string()
    .max(500, {
      message: "education.validation.descriptionTooLong",
    })
    .optional(),
});

const createEducationSchema = baseEducationSchema
  .refine(
    (data) => {
      if (data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "education.validation.endDateBeforeStart",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (data.endDate) {
        return data.endDate <= new Date();
      }
      return true;
    },
    {
      message: "education.validation.endDateFuture",
      path: ["endDate"],
    },
  );

const updateEducationSchema = baseEducationSchema
  .refine(
    (data) => {
      if (data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "education.validation.endDateBeforeStart",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (data.endDate) {
        return data.endDate <= new Date();
      }
      return true;
    },
    {
      message: "education.validation.endDateFuture",
      path: ["endDate"],
    },
  );

export { baseEducationSchema, createEducationSchema, updateEducationSchema };
