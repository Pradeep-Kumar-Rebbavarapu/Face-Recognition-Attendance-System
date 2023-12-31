import CourseCard from '@/components/CourseCard'
import React from 'react'
import { NextSeo } from 'next-seo';
export default function index() {
  return (
    <div className='py-32 grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 mx-5'>
      <NextSeo
				title="IIT INDORE - COURSES"
				description="IIT INDORE'S ATTENDANCE SYSTEM"
			/>
      <CourseCard title={"CS 203"} course_study={'BTECH 2ND YEAR'} desc={'DATA STRUCTURES AND ALGORITHMS'} />
      <CourseCard title={"CS 207"} course_study={'BTECH 2ND YEAR'} desc={'DATABASE AND INFORMATION SYSTEMS'} />
      <CourseCard title={"CS 201"} course_study={'BTECH 2nd YEAR'} desc={'DISCRETE MATHEMATICAL STRUCTURES'} />
      <CourseCard title={"MA 205"} course_study={'BTECH 2nd YEAR'} desc={'COMPLEX ANALYSIS AND DIFFERENTIAL EQUATIONS'} />

      <CourseCard title={"CS 203"} course_study={'BTECH 2ND YEAR'} desc={'DATA STRUCTURES AND ALGORITHMS'} />
      <CourseCard title={"CS 207"} course_study={'BTECH 2ND YEAR'} desc={'DATABASE AND INFORMATION SYSTEMS'} />
      <CourseCard title={"CS 201"} course_study={'BTECH 2nd YEAR'} desc={'DISCRETE MATHEMATICAL STRUCTURES'} />
      <CourseCard title={"MA 205"} course_study={'BTECH 2nd YEAR'} desc={'COMPLEX ANALYSIS AND DIFFERENTIAL EQUATIONS'} />

      <CourseCard title={"CS 203"} course_study={'BTECH 2ND YEAR'} desc={'DATA STRUCTURES AND ALGORITHMS'} />
      <CourseCard title={"CS 207"} course_study={'BTECH 2ND YEAR'} desc={'DATABASE AND INFORMATION SYSTEMS'} />
      <CourseCard title={"CS 201"} course_study={'BTECH 2nd YEAR'} desc={'DISCRETE MATHEMATICAL STRUCTURES'} />
      <CourseCard title={"MA 205"} course_study={'BTECH 2nd YEAR'} desc={'COMPLEX ANALYSIS AND DIFFERENTIAL EQUATIONS'} />
    </div>
  )
}



