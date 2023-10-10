import DateCard from '@/components/DateCard'
import EachCourseCard from '@/components/EachCourseCard'
import { QueryClient, useQuery, dehydrate } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import { SheetsDirective, SheetDirective, RangesDirective, RangeDirective, SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
export default function EachCourse() {
    const router = useRouter()
    const DateAttendance = useQuery(['EachDateAttendance'], () => {
        return fetchCourseWithDateAttendance(router.query.EachCourse, router.query.Date)
    })
    console.log(DateAttendance)
    return (
        <div className='h-full'>
            <div
                className={`${DateAttendance.isFetching ||
                    DateAttendance.isLoading ||
                    DateAttendance.isError ||
                    DateAttendance?.data?.data?.length < 2
                    ? "h-screen"
                    : "h-full"
                    } `}
            >

                {(DateAttendance.isLoading && !DateAttendance.isError) &&
                    (
                        <h1 className="text-white text-center text-3xl my-10">
                            Loading...
                        </h1>
                    )}
                {DateAttendance.isError &&
                    !DateAttendance.isLoading &&
                    !DateAttendance.isFetching &&
                    DateAttendance?.data?.data?.length !== 0 && (
                        <h1 className="text-white text-center text-3xl my-10">
                            Some Error Occured
                        </h1>
                    )}
                {!DateAttendance.isError &&
                    !DateAttendance.isLoading &&
                    !DateAttendance.isFetching &&
                    DateAttendance?.data?.data?.length === 0 && (
                        <h1 className="text-white text-center text-3xl my-10">
                            There Are No Projects Currently
                        </h1>
                    )}
                {!DateAttendance.isError &&
                    !DateAttendance.isLoading &&
                    !DateAttendance.isFetching &&
                    DateAttendance?.data?.data?.length !== 0 && (
                        <div className=''>
                            <form onSubmit={(e) => e.preventDefault()} className='w-full  flex justify-center flex-col '>
                                <button type="button" className=' p-3 mx-auto mt-20 bg-green-800 rounded-md text-white text-xl hover:ring-4 hover:ring-green-800 hover:ring-opacity-50 transition-all fade-in-out' onClick={() => {
                                    axios.post('https://www.pradeeps-video-conferencing.store/api/v1/DownloadExcel/', { 'course': router.query.EachCourse, "date": router.query.Date })
                                        .then(response => {
                                            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

                                            // Create a temporary <a> element to trigger the download
                                            const a = document.createElement('a');
                                            a.style.display = 'none';
                                            a.href = blobUrl;

                                            // Extract the filename from the response headers, if available
                                            const contentDisposition = response.headers['content-disposition'];
                                            let fileName = `${router.query.EachCourse}_${router.query.Date}.csv`; // Default filename
                                            if (contentDisposition) {
                                                const match = contentDisposition.match(/filename="(.+)"/);
                                                if (match) {
                                                    fileName = match[1];
                                                }
                                            }

                                            a.download = fileName; // Set the filename

                                            document.body.appendChild(a);

                                            // Trigger a click event on the <a> element to start the download
                                            a.click();

                                            // Remove the <a> element from the DOM
                                            document.body.removeChild(a);

                                            // Revoke the blob URL to free up resources
                                            window.URL.revokeObjectURL(blobUrl);
                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                }}>Download Attendance</button>
                            </form>
                            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 py-20 ">

                                {DateAttendance?.data?.data?.map((ele, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <EachCourseCard ele={ele} course={router.query.EachCourse} date={router.query.Date} />
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>
                    )}
            </div>

            <div>

            </div>
        </div>
    )
}

const fetchCourseWithDateAttendance = async (course, date) => {
    return axios.get(`https://www.pradeeps-video-conferencing.store/api/v1/GetEachCourseByDate/${course}/${date}`).then((response) => {
        return response.data
    })
}


export const getServerSideProps = async ({ req, res, params }) => {
    console.log(params)
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(["EachDateAttendance"], () => {
        return fetchCourseWithDateAttendance(params.EachCourse, params.Date)
    });
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};