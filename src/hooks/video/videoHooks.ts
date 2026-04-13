"use client"
import { videoServices } from "@/src/package/utilities/services/video/videoServices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useCreateVideoModule = (courseId: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (payload: FormData) => videoServices.createVideoModule(courseId, payload),
        onSuccess: ({data}) => {
            queryClient.invalidateQueries({queryKey: ["videos"]})
            toast.success("Video Berhasil di Upload!");
            router.push('/')
            return data
        }
    })

    return {
        createVideosModule: mutation.mutateAsync,
        isCreatingVideosModule: mutation.isPending
    }
}