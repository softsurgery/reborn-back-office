import { z } from "zod";

const createJobSchema = z.object({
  title: z
    .string({
      message: "job.validation.titleRequired",
    })
    .min(3, {
      message: "job.validation.titleTooShort",
    })
    .max(100, {
      message: "job.validation.titleTooLong",
    }),
  description: z
    .string({
      message: "job.validation.descriptionRequired",
    })
    .min(10, {
      message: "job.validation.descriptionTooShort",
    })
    .max(1000, {
      message: "job.validation.descriptionTooLong",
    }),

  price: z
    .number({
      message: "job.validation.priceRequired",
    })
    .positive({
      message: "job.validation.invalidPrice",
    }),
  currencyId: z.string({
    message: "job.validation.currencyRequired",
  }),
});

const updateJobSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "job.validation.titleTooShort",
    })
    .max(100, {
      message: "job.validation.titleTooLong",
    })
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, {
      message: "job.validation.invalidTitleFormat",
    })
    .optional(),

  description: z
    .string()
    .min(10, {
      message: "job.validation.descriptionTooShort",
    })
    .max(1000, {
      message: "job.validation.descriptionTooLong",
    })
    .optional(),

  price: z
    .number({
      message: "job.validation.priceRequired",
    })
    .positive({
      message: "job.validation.invalidPrice",
    })
    .optional(),

  currencyId: z.string({
    message: "job.validation.currencyRequired",
  }),
});

export { createJobSchema, updateJobSchema };
