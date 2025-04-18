// region.validation.ts
import { z } from "zod";

const regionSchema = z.object({
  label: z
    .string()
    .min(2, { message: "Region label must be at least 2 characters long" })
    .max(50, { message: "Region label must not exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Region label must contain only letters and spaces",
    }),
});

export { regionSchema };
