"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCreateVideoModule } from '@/src/hooks/video/videoHooks';
import { UploadVideosSchema, UploadVideosType } from '@/src/package/schema/video/videoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Loader2, Plus, Trash2, VideoIcon, X } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const CreateVideos = () => {
    const {id: courseId}  = useParams();

    const { createVideosModule, isCreatingVideosModule } = useCreateVideoModule(courseId as string)

    const { register, handleSubmit, formState: {errors}, control,setValue, watch  } = useForm<UploadVideosType>({
      resolver: zodResolver(UploadVideosSchema as any),
      defaultValues: {
        videos: [
          {
            title: '',
            order: 1,
            duration: 0,
            isPublished: false,
            file: undefined as any,
          }
        ]
      }
    });

    const { fields, append, remove, move } = useFieldArray({
      control,
      name: "videos"
    });

    const  watchVideos = watch("videos");
    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) =>{
      const file = e.target.files?.[0]
      if (!file) return;
      setValue(`videos.${index}.file`, file, {shouldValidate: true})
    }

    const addVideoCard = () => {
      append({
        title: '',
        duration: 0,
        order: fields.length + 1,
        isPublished: false,
        file:  undefined as any,
      })
    }

    const onSubmit = async(data: UploadVideosType) => {
      const formData = new FormData();

      data.videos.map((video) => {
        formData.append(`videos`, video.file)
        formData.append(`title`, video.title);
        formData.append(`order`, String(video.order));
        formData.append(`duration`, String(video.duration));
        formData.append(`isPublished`, String(video.isPublished));
      });

      return await createVideosModule(formData)
    }
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Upload Modul Video</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tambahkan video materi untuk course ini
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border text-sm text-muted-foreground">
          <VideoIcon size={14} />
          {fields.length} video
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => {
          const fileValue = (watchVideos as any)?.[index]?.file;
          const fileError = errors.videos?.[index]?.file;

          return (
            <Card key={field.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Video {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" className="size-7"
                      onClick={() => move(index, index - 1)} disabled={index === 0}>
                      <ChevronUp size={14} />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="size-7"
                      onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
                      <ChevronDown size={14} />
                    </Button>
                    <Button type="button" variant="ghost" size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => {
                        if (fields.length === 1) { toast.warning("Minimal 1 video"); return; }
                        remove(index);
                      }}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label>Judul Video <span className="text-destructive">*</span></Label>
                  <Input placeholder="contoh: Pengenalan Materi Bab 1" {...register(`videos.${index}.title`)} />
                  {errors.videos?.[index]?.title && (
                    <p className="text-xs text-destructive">{errors.videos[index].title.message}</p>
                  )}
                </div>

                {/* Order + Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Urutan <span className="text-destructive">*</span></Label>
                    <Input type="number" min={1} {...register(`videos.${index}.order`)} />
                    {errors.videos?.[index]?.order && (
                      <p className="text-xs text-destructive">{errors.videos[index].order.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Durasi (menit) <span className="text-destructive">*</span></Label>
                    <Input type="number" min={1} placeholder="contoh: 15" {...register(`videos.${index}.duration`)} />
                    {errors.videos?.[index]?.duration && (
                      <p className="text-xs text-destructive">{errors.videos[index].duration.message}</p>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-1.5">
                  <Label>File Video <span className="text-destructive">*</span></Label>
                  {fileValue ? (
                    <div className="flex items-center justify-between px-3 py-2.5 border rounded-lg bg-slate-50">
                      <div className="flex items-center gap-2">
                        <VideoIcon size={14} className="text-slate-400" />
                        <div>
                          <p className="text-sm font-medium line-clamp-1">{fileValue.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(fileValue.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="size-6"
                        onClick={() => setValue(`videos.${index}.file`, undefined as any, { shouldValidate: true })}>
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor={`file-${index}`}
                      className={`flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        fileError ? "border-destructive bg-destructive/5" : "hover:border-primary/50 hover:bg-slate-50"
                      }`}>
                      <VideoIcon size={20} className="text-slate-400" />
                      <p className="text-sm text-muted-foreground">Klik untuk pilih file video</p>
                      <p className="text-xs text-slate-400">MP4, WEBM, MKV — maks 500MB</p>
                      <input id={`file-${index}`} type="file"
                        accept="video/mp4,video/webm,video/x-matroska"
                        className="hidden"
                        onChange={(e) => handleFileChange(index, e)} />
                    </label>
                  )}
                  {fileError && <p className="text-xs text-destructive">{fileError.message}</p>}
                </div>

                {/* isPublished */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">Publish video ini</p>
                    <p className="text-xs text-muted-foreground">Video langsung terlihat oleh siswa</p>
                  </div>
                  <Controller
                    control={control}
                    name={`videos.${index}.isPublished`}
                    render={({ field }) => (
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Tambah Video */}
        <Button type="button" variant="default" className="w-full border-dashed" onClick={addVideoCard}>
          <Plus size={16} className="mr-2" />
          Tambah Video
        </Button>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="default" onClick={() => window.history.back()}
            disabled={isCreatingVideosModule}>
            Batal
          </Button>
          <Button type="submit" disabled={isCreatingVideosModule}>
            {isCreatingVideosModule ? (
              <><Loader2 className="mr-2 size-4 animate-spin" />Mengupload...</>
            ) : (
              `Upload ${fields.length} Video`
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateVideos
