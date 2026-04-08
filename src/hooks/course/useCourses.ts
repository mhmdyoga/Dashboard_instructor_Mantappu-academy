import { CourseServices } from "@/src/package/utilities/services/courses/courseServices";
import { CourseFilters } from "@/src/package/utilities/types/courseTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



export const useGetCourses = (filters: CourseFilters = {}) => {
    const {data, refetch, isError, isLoading} = useQuery({
        queryKey: ["courses", filters],
        queryFn: () => CourseServices.getCourses(filters),
        staleTime: 30 * 1000, // 30s
        placeholderData: (prev) => prev
    });

    return {
        courses: data?.data ?? [],
        meta: data?.meta,
        isLoading,
        isError,
        refetch
    }
} 


export const useGetCourseById = (id: string) => {
    const {data: course, isError, isLoading } = useQuery({
        queryKey: ["course", id],
        queryFn: () => CourseServices.getCourseById(id),
        staleTime: 5 * 60 * 1000,
        enabled: !!id
    });
    
    return {
        data: (course as any)?.data,
        isError,
        isLoading
    }
}

export const useGetCourseBySlug = (slug: string) => {
    const {data: course, isError, isLoading } = useQuery({
        queryKey: ["course", slug],
        queryFn: () => CourseServices.getCourseByslug(slug),
        staleTime: 5 * 60 * 1000,
        enabled: !!slug
    });

    return {
        data: (course as any)?.data,
        isError,
        isLoading
    }
}

export type UpdateCourseTypes = {
    courseId: string | string[],
    payload: FormData
}


export const useCourses = () => {

    const queryClient = useQueryClient();
    
   const createCourseMutation = useMutation({
        mutationFn: (payload: FormData) => CourseServices.createCourse(payload),
        onSuccess: ({data}) => {
            queryClient.invalidateQueries({queryKey: ["courses"]})
            toast.success('Course Berhasil Dibuat!');
            return data;
        },
        onError: (err) => {
            console.log(err);
            toast.error('Gagal Membuat course')
        }
    });

    const updateCourseMutation = useMutation({
        mutationFn: ({courseId, payload}: UpdateCourseTypes) => CourseServices.updateCourse({courseId, payload}),
        onSuccess: ({data}) => {
            queryClient.invalidateQueries({queryKey: ["courses"]})
            toast.success('Update course Berhasil!')
            return data;
        }
    });

    const deleteCourseMutation = useMutation({
        mutationFn: (id: string) => CourseServices.deleteCourse(id),
        onSuccess: () => {
            toast.success('Course berhasil di hapus!');
        },
        onError: (err) => {
            console.log(err);
            toast.error('Gagal menghapus course')
        }
    });


    return {
        createCourse: createCourseMutation,
        updateCourse: updateCourseMutation,
        deleteCourse: deleteCourseMutation,
        isCreating: createCourseMutation.isPending,
        isUpdating: updateCourseMutation.isPending,
        isDeleting: deleteCourseMutation.isPending
    }
}