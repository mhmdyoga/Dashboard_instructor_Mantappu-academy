import { api } from "../../axiosInstance/axiosInstance";
import { ResponseData } from "../../types/response";
import { Video } from "../../types/videoTypes";


export const videoServices = {
  getAllVideo: async(courseId: string): Promise<Video[] | null> => {
    const {data}  = await api.get(`/course/${courseId}/video`);
    return data;
  },

  createVideoModule: async(courseId: string, payload: FormData): Promise<ResponseData<Video[]>> => {
     const {data} = await api.post(`/course/${courseId}/video/create`, payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
     });
     return data;
  }
}