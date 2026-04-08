import { z } from "zod";

const MB_BYTES = 1000000; // 3MB
const ACCEPTED_MIME_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const CreateCourseSchema = z.object({
  title: z.string().min(5, "Judul harus punya minimal 5 karakter"),
  price: z.coerce.number().int(),
  description: z
    .string()
    .min(10, "Description harus punya minimal 10 karakter!"),
  isPublished: z.boolean().default(false),
  category: z.enum(["SKD", "SNBT", "REGULER"]).default("REGULER"),
  instructorId: z
    .string()
    .min(1, "instructor id harus ada, Mohon coba login kembali"),
  thumbnail: z.instanceof(File).superRefine((f, ctx) => {
    // First, add an issue if the mime type is wrong.
    if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
          ", ",
        )}] but was ${f.type}`,
      });
    }
    // Next add an issue if the file size is too large.
    if (f.size > 3 * MB_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: "array",
        message: `The file must not be larger than ${3 * MB_BYTES} bytes: ${
          f.size
        }`,
        maximum: 3 * MB_BYTES,
        inclusive: true,
        origin: "file",
      });
    }
  }),
});

export const UpdateCourseSchema = CreateCourseSchema.partial();

export type CreateCourseType = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseType = z.infer<typeof UpdateCourseSchema>