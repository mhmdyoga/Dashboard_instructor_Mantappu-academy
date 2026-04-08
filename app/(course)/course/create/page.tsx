"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { useCourses } from '@/src/hooks/course/useCourses';
import { CreateCourseSchema, CreateCourseType } from '@/src/package/schema/courses/courseSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ImagePlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const CreateCourse = () => {
    const { user } = useAuth();
    const { createCourse, isCreating } = useCourses();

    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setPreviewThumbnail] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            setValue("instructorId", user.id)
            console.log(user.id)
        }
    }, [user?.id]);
    

    const { register, handleSubmit, formState: {errors}, watch, setValue, reset } = useForm<CreateCourseType>({
        resolver: zodResolver(CreateCourseSchema) as any,
        defaultValues: {
            price: 0,
            isPublished: false,
            category: "REGULER"
        },
        mode: 'onChange'
    });

    console.log(errors)

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        setThumbnail(file);
        setPreviewThumbnail(URL.createObjectURL(file));
        setValue("thumbnail", file, {shouldValidate: true})
    }

    const removeThumbnail = () => {
        setThumbnail(null);
        setPreviewThumbnail(null);
        setValue("thumbnail", undefined as any, {shouldValidate: true})
    }

    const isPublished = watch("isPublished");

    const onSubmit = async(data: CreateCourseType) => {
       try {
         const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("category", data.category);
        formData.append("isPublished", String(data.isPublished))

        const instructorId = data.instructorId ?? user?.id;
        if (instructorId) formData.append("instructorId", instructorId)
        if(thumbnail) formData.append("thumbnail", thumbnail);

       await createCourse.mutateAsync(formData);

       reset();
       setThumbnail(null);
       setPreviewThumbnail(null);

       if (user?.id) {
            setValue('instructorId', user.id)
       };
       
       } catch (error) {
        console.log(error)
       }
    }

  return (
   <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Buat Course Baru</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Isi detail course yang ingin kamu buat
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
            checked={isPublished}
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
                    Deskripsi <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan apa yang akan dipelajari siswa..."
                    rows={5}
                    disabled={isCreating}
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
                      disabled={isCreating}
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
                    <Select
                      disabled={isCreating}
                      onValueChange={(val) =>
                        setValue('category', val as CreateCourseType['category'], {
                          shouldValidate: true, // trigger validasi langsung
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="SNBT">SNBT</SelectItem>
                          <SelectItem value="SKD">SKD</SelectItem>
                          <SelectItem value="REGULER">Reguler</SelectItem>
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
                {thumbnailPreview ? (
                  // Preview
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={thumbnailPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  // Upload area
                  <label
                    htmlFor="thumbnail"
                    className="aspect-video flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="p-3 bg-slate-100 rounded-full">
                      <ImagePlus className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">
                        Klik untuk upload
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        JPEG, PNG, WebP — maks 2MB
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

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t">
          <Button
            type="button"
            variant="outline"
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
              'Buat Course'
            )}
          </Button>
        </div>
      </form>
    </div>

  )
}

export default CreateCourse;
