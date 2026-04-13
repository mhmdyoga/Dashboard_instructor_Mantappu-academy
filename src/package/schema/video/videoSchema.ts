import z from "zod";

export const VideoItemSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(50),
  order: z.coerce.number().int().min(1, "Urutan minimal 1"),
  duration: z.coerce.number().int().min(1, "Durasi wajib diisi"),
  isPublished: z.boolean().default(false),
  file: z
    .instanceof(File, { message: "File video wajib dipilih" })
    .refine(
      (f) => ["video/mp4", "video/webm", "video/x-matroska"].includes(f.type),
      "Format harus MP4, WEBM, atau MKV"
    )
    .refine((f) => f.size <= 500 * 1024 * 1024, "Maksimal ukuran 500MB"),
});

// ✅ Schema keseluruhan form — array of video
export const UploadVideosSchema = z.object({
  videos: z.array(VideoItemSchema).min(1, "Minimal 1 video"),
});

export type UploadVideosType = z.infer<typeof UploadVideosSchema>;