import DateCard from '@/components/DateCard'
import EachCourseCard from '@/components/EachCourseCard'
import { QueryClient, useQuery,dehydrate } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo';
export default function EachCourse() {
    const router = useRouter()
    const Attendance = useQuery(['Attendance'],()=>{
      return fetchCourseAttendance(router.query.EachCourse)
  })
    console.log(Attendance)
    
  return (
    <div className='h-full'>
       <NextSeo
				title="IIT INDORE - COURSES"
				description="IIT INDORE'S ATTENDANCE SYSTEM"
			/>
        <div
          className={`${Attendance.isFetching ||
            Attendance.isLoading ||
            Attendance.isError ||
            Attendance?.data?.data?.length < 2
            ? "h-screen"
            : "h-full"
            } `}
        >
          
          {(Attendance.isLoading && !Attendance.isError) &&
             (
              <h1 className="text-white text-center text-3xl my-10">
                Loading...
              </h1>
            )}
          {Attendance.isError &&
            !Attendance.isLoading &&
            !Attendance.isFetching &&
            Attendance?.data?.data?.length !== 0 && (
              <h1 className="text-white text-center text-3xl my-10">
                Some Error Occured
              </h1>
            )}
          {!Attendance.isError &&
            !Attendance.isLoading &&
            !Attendance.isFetching &&
            Attendance?.data?.data?.length === 0 && (
              <h1 className="text-white text-center text-3xl my-10">
                There Are No Projects Currently
              </h1>
            )}
          {!Attendance.isError &&
            !Attendance.isLoading &&
            !Attendance.isFetching &&
            Attendance?.data?.data?.length !== 0 && (
              <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 py-20">
                {Attendance?.data?.data?.map((ele, index) => {
                  return (
                    <React.Fragment key={index}>
                    <DateCard ele={ele}/>
                    
                    </React.Fragment>
                  )
                })}
              </div>




            )}
        </div>
    </div>
  )
}

const fetchCourseAttendance = (course) =>{
    return axios.get(`http://127.0.0.1:8000/api/v1/GetCoursesByDate/${course}`).then((response)=>{
      console.log(response.data)
        return response.data
    }).catch((err)=>{
      console.log(err)
    })
}

export const getServerSideProps = async ({req,res,params}) => {
  
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["Attendance"],()=>{
      return fetchCourseAttendance(params.EachCourse)
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};