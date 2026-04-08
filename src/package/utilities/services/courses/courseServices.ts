import { UpdateCourseType } from "@/src/package/schema/courses/courseSchema";
import { api } from "../../axiosInstance/axiosInstance";
import { Course, CourseFilters } from "../../types/courseTypes";
import { PaginatedResult } from "../../types/paginatedTypes";
import { ResponseData } from "../../types/response";
import { UpdateCourseTypes } from "@/src/hooks/course/useCourses";


export const CourseServices = {
    getCourses: async(filters: CourseFilters = {}): Promise<PaginatedResult<Course>> => {
            const {data} =  await api.get('/course/courses', {params: filters});
            return data;
    },

    getCourseById: async(id: string): Promise<Course | null> => {
        const {data} = await api.get(`/course/details/${id}`);
        return data;
    },

    getCourseByslug: async(slug: string): Promise<Course | null> => {
        const {data} = await api.get(`/course/${slug}`);
        return data;
    },

    createCourse: async(payload: FormData): Promise<ResponseData<Course>> => {
            const {data} = await api.post('/course', payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return data;
    },

    updateCourse: async({courseId, payload}: UpdateCourseTypes): Promise<ResponseData<UpdateCourseType>> => {
        const {data}= await api.put(`/course/update/${courseId}`, payload);
        return data;
    },

    deleteCourse: async(courseId: string): Promise<void> => {
        return await api.delete(`/course/delete/${courseId}`)
    }
}