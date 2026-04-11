import { api } from "../../axiosInstance/axiosInstance";
import { CreateQuizPayload, Quiz } from "../../types/quizTypes";


export const quizServices = {
    createQuiz: async(courseId: string,payload: CreateQuizPayload): Promise<{success: true, data: Quiz}> => {
        const {data} = await api.post(`/course/${courseId}/quiz/create`, payload);
        return data;
    }
}