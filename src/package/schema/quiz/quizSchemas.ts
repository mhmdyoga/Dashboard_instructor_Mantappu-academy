import { z } from 'zod';

// Schema untuk satu pilihan jawaban
export const OptionSchema = z.object({
  text: z
    .string({ error: 'Teks pilihan wajib diisi' })
    .min(1, 'Teks pilihan tidak boleh kosong'),
  isCorrect: z.boolean().default(false),
});

// Schema untuk satu soal
export const QuestionSchema = z.object({
  text: z
    .string({ error: 'Teks soal wajib diisi' })
    .min(1, 'Teks soal tidak boleh kosong'),
  order: z.number().int().min(1),
  points: z.coerce
    .number({ error: 'Poin harus berupa angka' })
    .int()
    .min(1, 'Minimal 1 poin')
    .default(1),
  options: z
    .array(OptionSchema)
    .min(2, 'Minimal 2 pilihan jawaban')
    .max(5, 'Maksimal 5 pilihan jawaban')
    .refine(
      (opts) => opts.filter((o) => o.isCorrect).length === 1,
      { message: 'Tepat 1 pilihan harus ditandai sebagai jawaban benar' }
    ),
});

// Schema utama quiz
export const CreateQuizSchema = z.object({
  title: z
    .string({ error: 'Judul wajib diisi' })
    .min(3, 'Judul minimal 3 karakter')
    .max(100, 'Judul maksimal 100 karakter'),
  description: z.string().optional(),
  passingScore: z.coerce
    .number({ error: 'Nilai kelulusan harus berupa angka' })
    .int()
    .min(1, 'Minimal 1%')
    .max(100, 'Maksimal 100%')
    .default(70),
  questions: z
    .array(QuestionSchema)
    .min(1, 'Minimal 1 soal harus ditambahkan'),
});

export type OptionType = z.infer<typeof OptionSchema>;
export type QuestionType = z.infer<typeof QuestionSchema>;
export type CreateQuizType = z.infer<typeof CreateQuizSchema>;