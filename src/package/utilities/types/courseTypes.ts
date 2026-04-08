
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isPublished: boolean;
  category?: 'SNBT' | 'SKD' | 'REGULER', 
  instructor: {
    id: string;
    name: string;
    avatar: string | null;
  };
  _count: {
    enrollments: number;
  };
  createdAt: string;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: 'SNBT' | 'SKD' | 'REGULER',
  isPublished?: boolean
}
