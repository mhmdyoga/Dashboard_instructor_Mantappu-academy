"use client";
import { useAuth } from '@/src/hooks/auth/use-auth';
import { UpdateCourseTypes, useCourses, useGetCourseById } from '@/src/hooks/course/useCourses';
import { UpdateCourseSchema, UpdateCourseType } from '@/src/package/schema/courses/courseSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, ImagePlus, Loader2, X } from 'lucide-react';
import Cookies from 'js-cookie';
import Image from 'next/image';

const UpdateCourse = () => {
  const { user } = useAuth();
  const { updateCourse, isUpdating } = useCourses();
  const { id } = useParams();
  const { data: course, isLoading: isFetching } = useGetCourseById(id as string);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  console.log('log dari update course: ',course);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UpdateCourseType>({
    resolver: zodResolver(UpdateCourseSchema) as any,
    defaultValues: {
      price: 0,
      isPublished: false,
    },
  });

 useEffect(() => {
  if (course && user?.id) {
    reset({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      isPublished: course.isPublished,
      instructorId: user.id, // ✅ langsung dari sini, tidak perlu useEffect terpisah
    });

    if (course.thumbnail) {
      setPreviewThumbnail(course.thumbnail);
    }
  }
}, [course, user?.id]);

const isPublished = watch('isPublished');
  const currentCategory = watch('category');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnail(file);
    setPreviewThumbnail(URL.createObjectURL(file));
    setValue('thumbnail', file, { shouldValidate: true });
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setPreviewThumbnail(null);
    setValue('thumbnail', undefined as any, { shouldValidate: true });
  };

  const onSubmit = async (data: UpdateCourseType) => {
    try {
      
      if (!id) return;

      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      // isPublished harus selalu dikirim — false juga valid
      formData.append('isPublished', String(data.isPublished));
      if (data.price !== undefined) formData.append('price', String(data.price));
      if (data.category) formData.append('category', data.category);
      if (thumbnail) formData.append('thumbnail', thumbnail);

      const payload: UpdateCourseTypes = {
        courseId: id as string,
        payload: formData,
      };

      await updateCourse.mutateAsync(payload);
    } catch (error) {
      console.log(error);
    }
  };

  // Loading state saat fetch course
  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Memuat data course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Update informasi course kamu
          </p>
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border">
          {isPublished ? (
            <Eye size={16} className="text-green-500" />
          ) : (
            <EyeOff size={16} className="text-slate-400" />
          )}
          <span className="text-sm font-medium">
            {isPublished ? 'Published' : 'Draft'}
          </span>
          <Switch
            checked={!!isPublished}
            onCheckedChange={(val) => setValue('isPublished', val)}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kiri — form utama */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informasi Course</CardTitle>
                <CardDescription>
                  Judul, deskripsi, harga, dan kategori course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Judul Course <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="contoh: Belajar SNBT dari Nol"
                    disabled={isUpdating}
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Deskripsi <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan apa yang akan dipelajari siswa..."
                    rows={5}
                    disabled={isUpdating}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                {/* Price + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Harga (IDR) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      placeholder="0 = Gratis"
                      disabled={isUpdating}
                      {...register('price')}
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Kategori <span className="text-destructive">*</span>
                    </Label>
                    {/* ← pakai value dari watch supaya prefill bekerja */}
                    <Select
                      disabled={isUpdating}
                      value={currentCategory}
                      onValueChange={(val) =>
                        setValue('category', val as UpdateCourseType['category'], {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={currentCategory} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="SNBT">SNBT</SelectItem>
                          <SelectItem value="SKD">SKD</SelectItem>
                          <SelectItem value="REGULER">REGULER</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kanan — thumbnail */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Thumbnail</CardTitle>
                <CardDescription>Rekomendasi 1280 × 720px</CardDescription>
              </CardHeader>
              <CardContent>
                {previewThumbnail ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={previewThumbnail}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="thumbnail"
                    className={`aspect-video flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      errors.thumbnail
                        ? 'border-destructive bg-destructive/5'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="p-3 bg-slate-100 rounded-full">
                      <ImagePlus className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        Klik untuk upload
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        JPEG, PNG, WebP — maks 3MB
                      </p>
                    </div>
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                )}
                {errors.thumbnail && (
                  <p className="text-sm text-destructive mt-2">
                    {errors.thumbnail.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Info card */}
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
                <p>💡 <strong>Tips:</strong></p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>Judul yang jelas meningkatkan klik</li>
                  <li>Thumbnail menarik = lebih banyak siswa</li>
                  <li>Set ke Draft dulu sebelum publish</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={isUpdating}
            onClick={() => window.history.back()}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;



// ## Perbedaan utama vs Create
// ```
// Create                         Update
// ──────────────────────────────────────────
// defaultValues kosong     →     prefill dari API via reset()
// Select tanpa value       →     Select pakai value={currentCategory}
// Button "Buat Course"     →     Button "Simpan Perubahan"
// isPublished: false       →     isPublished dari data course
// thumbnail kosong         →     thumbnail dari URL cloudinary