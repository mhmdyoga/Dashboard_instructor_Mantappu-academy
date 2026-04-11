import { quizServices } from "@/src/package/utilities/services/quiz/quizServices";
import { CreateQuizPayload } from "@/src/package/utilities/types/quizTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateQuiz = (courseId: string) => {
    const queryClient =  useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (payload: CreateQuizPayload) => quizServices.createQuiz(courseId,payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["quiz", courseId]})
            toast.success('Quiz Berhasil DIbuat!');
            router.back()
        },
        onError: (err: any) => {
             toast.error(err.response?.data?.message ?? 'Gagal membuat quiz');
        }
    })

    return {
        CreateQuiz: mutation.mutate,
        isCreating: mutation.isPending
    }
}