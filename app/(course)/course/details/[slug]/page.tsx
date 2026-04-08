"use client"
import { useGetCourseBySlug } from '@/src/hooks/course/useCourses';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React from 'react'

const DetailsCourse = () => {

    const {slug} = useParams();
    const { data: course, isLoading } = useGetCourseBySlug(slug as string);

    if (!course) {
      return (
        <div className='flex items-center justify-center h-screen'>
          <h2>Course Tidak Ditemukan, please check lagi</h2>
        </div>
      )
    }
    
  return (
    <div>
      {isLoading ?(
        <div className='flex items-center justify-center h-screen'>
          <Loader2 className='w-24 h-24 animate-spin'/>
        </div>
      ): (
        <div className='flex flex-row gap-4'>
           <div className='flex flex-col gap-2'>
              <Image src={course?.thumbnail} alt={course?.thumbnail} width={559} height={379} className='w-auto h-auto' priority />
              <p className='text-black font-semibold'>{course?.description}</p>
           </div>
           <div className='flex flex-col gap-2'>
              <h1 className='font-bold'>{course?.title}</h1>
              <h3 className='font-semibold'>price: Rp.{course?.price}</h3>
              <h3 className='font-semibold'>category: {course?.category}</h3>
           </div>
        </div>
      )}
      
    </div>
  )
}

export default DetailsCourse
