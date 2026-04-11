'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Loader2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateQuizSchema, CreateQuizType } from '@/src/package/schema/quiz/quizSchemas';
import { useCreateQuiz } from '@/src/hooks/quiz/quizHooks';

export default function CreateQuizPage() {
  const { id: courseId } = useParams();
  const { CreateQuiz, isCreating } = useCreateQuiz(courseId as string);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set([0]) // soal pertama langsung terbuka
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateQuizType>({
    resolver: zodResolver(CreateQuizSchema as any),
    defaultValues: {
      title: '',
      description: '',
      passingScore: 70,
      questions: [
        {
          text: '',
          order: 1,
          points: 1,
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    },
  });

  const {
    fields: questions,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: 'questions' });

  const toggleExpand = (index: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const addQuestion = () => {
    const newIndex = questions.length;
    appendQuestion({
      text: '',
      order: newIndex + 1,
      points: 1,
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    });
    // Auto expand soal baru
    setExpandedQuestions((prev) => new Set([...prev, newIndex]));
  };

  const onSubmit = (data: CreateQuizType) => {
    CreateQuiz(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Buat Quiz</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tambahkan quiz untuk menguji pemahaman siswa
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Info Quiz */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Quiz</CardTitle>
            <CardDescription>
              Judul, deskripsi, dan nilai minimum kelulusan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Judul Quiz <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="contoh: Quiz Chapter 1 — Dasar Pemrograman"
                disabled={isCreating}
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Deskripsi{' '}
                <span className="text-muted-foreground text-xs">(opsional)</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Jelaskan topik yang diujikan..."
                rows={2}
                disabled={isCreating}
                {...register('description')}
              />
            </div>

            {/* Passing score */}
            <div className="space-y-2 max-w-[220px]">
              <Label htmlFor="passingScore">
                Nilai Kelulusan (%) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="passingScore"
                  type="number"
                  min={1}
                  max={100}
                  disabled={isCreating}
                  {...register('passingScore')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  %
                </span>
              </div>
              {errors.passingScore && (
                <p className="text-sm text-destructive">{errors.passingScore.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Daftar Soal</h2>
              <Badge variant="secondary">{questions.length} soal</Badge>
            </div>
            {/* Error kalau questions kosong */}
            {errors.questions?.root && (
              <p className="text-sm text-destructive">
                {errors.questions.root.message}
              </p>
            )}
          </div>

          {questions.map((question, qIndex) => (
            <QuestionCard
              key={question.id}
              qIndex={qIndex}
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              isCreating={isCreating}
              isExpanded={expandedQuestions.has(qIndex)}
              onToggle={() => toggleExpand(qIndex)}
              onRemove={() => removeQuestion(qIndex)}
              canRemove={questions.length > 1}
            />
          ))}

          <Button
            type="button"
            variant="default"
            onClick={addQuestion}
            disabled={isCreating}
            className="w-full border-dashed"
          >
            <Plus size={16} className="mr-2" />
            Tambah Soal
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="default"
            disabled={isCreating}
            onClick={() => window.history.back()}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Buat Quiz'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Komponen QuestionCard ─────────────────────────────────────
interface QuestionCardProps {
  qIndex: number;
  control: any;
  register: any;
  watch: any;
  setValue: any;
  errors: any;
  isCreating: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

function QuestionCard({
  qIndex,
  control,
  register,
  watch,
  setValue,
  errors,
  isCreating,
  isExpanded,
  onToggle,
  onRemove,
  canRemove,
}: QuestionCardProps) {
  const {
    fields: options,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${qIndex}.options`,
  });

  const watchedOptions = watch(`questions.${qIndex}.options`);
  const watchedText = watch(`questions.${qIndex}.text`);

  const setCorrectOption = (optIndex: number) => {
    options.forEach((_, i) => {
      setValue(
        `questions.${qIndex}.options.${i}.isCorrect`,
        i === optIndex,
        { shouldValidate: true }
      );
    });
  };

  const hasCorrectAnswer = watchedOptions?.some((o: any) => o.isCorrect);

  return (
    <Card className={`transition-all ${
      errors.questions?.[qIndex] ? 'border-destructive' : ''
    }`}>
      {/* Question Header — selalu tampil */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        <GripVertical size={16} className="text-slate-300 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Soal {qIndex + 1}
            </span>
            {hasCorrectAnswer && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                ✓ Jawaban ditandai
              </Badge>
            )}
            {errors.questions?.[qIndex] && (
              <Badge variant="destructive" className="text-xs">
                Ada error
              </Badge>
            )}
          </div>
          {/* Preview teks soal kalau collapsed */}
          {!isExpanded && watchedText && (
            <p className="text-sm text-slate-600 truncate mt-0.5">{watchedText}</p>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-destructive"
              disabled={isCreating}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 size={14} />
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </div>

      {/* Question Body — hanya tampil kalau expanded */}
      {isExpanded && (
        <CardContent className="border-t pt-4 space-y-4">
          {/* Teks soal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">
                Teks Soal <span className="text-destructive">*</span>
              </Label>
              {/* Poin */}
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Poin:</Label>
                <Input
                  type="number"
                  min={1}
                  className="w-16 h-7 text-xs"
                  disabled={isCreating}
                  {...register(`questions.${qIndex}.points`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>
            <Textarea
              placeholder={`Tulis pertanyaan untuk soal ${qIndex + 1}...`}
              rows={2}
              disabled={isCreating}
              {...register(`questions.${qIndex}.text`)}
            />
            {errors.questions?.[qIndex]?.text && (
              <p className="text-xs text-destructive">
                {errors.questions[qIndex].text.message}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label className="text-sm">
              Pilihan Jawaban <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Klik ikon{' '}
              <span className="text-green-500">●</span>{' '}
              untuk menandai jawaban yang benar
            </p>

            {/* Error kalau belum ada yang benar */}
            {errors.questions?.[qIndex]?.options?.root && (
              <p className="text-xs text-destructive">
                {errors.questions[qIndex].options.root.message}
              </p>
            )}

            {options.map((option, oIndex) => {
              const isCorrect = watchedOptions?.[oIndex]?.isCorrect ?? false;

              return (
                <div key={option.id} className="flex items-center gap-2">
                  {/* Toggle jawaban benar */}
                  <button
                    type="button"
                    onClick={() => setCorrectOption(oIndex)}
                    disabled={isCreating}
                    title={isCorrect ? 'Jawaban benar' : 'Tandai sebagai jawaban benar'}
                    className={`flex-shrink-0 transition-colors ${
                      isCorrect
                        ? 'text-green-500'
                        : 'text-slate-300 hover:text-slate-400'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  {/* Input teks pilihan */}
                  <Input
                    placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`} // A, B, C, D
                    disabled={isCreating}
                    className={`flex-1 transition-colors ${
                      isCorrect
                        ? 'border-green-300 bg-green-50/50 focus-visible:ring-green-300'
                        : ''
                    }`}
                    {...register(`questions.${qIndex}.options.${oIndex}.text`)}
                  />

                  {/* Hapus pilihan */}
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 flex-shrink-0 text-slate-300 hover:text-destructive"
                      onClick={() => removeOption(oIndex)}
                      disabled={isCreating}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              );
            })}

            {/* Tambah pilihan */}
            {options.length < 5 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => appendOption({ text: '', isCorrect: false })}
                disabled={isCreating}
                className="w-full h-8 text-xs border border-dashed text-slate-400 hover:text-slate-600"
              >
                <Plus size={12} className="mr-1" />
                Tambah Pilihan
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}