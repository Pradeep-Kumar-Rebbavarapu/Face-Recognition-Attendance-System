import { useRouter } from 'next/router'
import React from 'react'
import {useQuery,QueryClient,dehydrate} from '@tanstack/react-query'
import axios from 'axios'
import EachPhotoComp from '@/components/EachPhotoComp'
import StudentsPresent from '@/components/StudentsPresent'
export default function EachPhoto() {
    const router = useRouter()
    const EachPhotoDetails = useQuery(['EachPhotoDetails'], () => {
        return fetchEachPhotoDetails(router.query.EachPhoto)
    })
    console.log(EachPhotoDetails.data)
    return (
        <div className='h-full'>
            <div
                className={`${EachPhotoDetails.isFetching ||
                    EachPhotoDetails.isLoading ||
                    EachPhotoDetails.isError ||
                    EachPhotoDetails?.data?.length < 2
                    ? "h-screen"
                    : "h-full"
                    } `}
            >

                {(EachPhotoDetails.isLoading && !EachPhotoDetails.isError) &&
                     (
                        <h1 className="text-white text-center text-3xl my-10">
                            Loading...
                        </h1>
                    )}
                {EachPhotoDetails.isError &&
                    !EachPhotoDetails.isLoading &&
                    !EachPhotoDetails.isFetching &&
                    EachPhotoDetails?.data?.length !== 0 && (
                        <h1 className="text-white text-center text-3xl my-10">
                            Some Error Occured
                        </h1>
                    )}
                {!EachPhotoDetails.isError &&
                    !EachPhotoDetails.isLoading &&
                    !EachPhotoDetails.isFetching &&
                    EachPhotoDetails?.data?.length === 0 && (
                        <h1 className="text-white text-center text-3xl my-10">
                            There Are No Projects Currently
                        </h1>
                    )}
                {!EachPhotoDetails.isError &&
                    !EachPhotoDetails.isLoading &&
                    !EachPhotoDetails.isFetching &&
                    EachPhotoDetails?.data?.length !== 0 && (
                        <div className="">
                            <EachPhotoComp ele={EachPhotoDetails?.data} />
                            <StudentsPresent ele={EachPhotoDetails?.data?.students} />
                        </div>




                    )}
            </div>

            <div>

            </div>
        </div>
    )
}

const fetchEachPhotoDetails = async (id) => {
    return axios.get(`https://www.pradeeps-video-conferencing.store/api/v1/GetEachPhotoDetails/${id}`).then((response) => {
        return response.data
    })
}


export const getServerSideProps = async ({ req, res, params }) => {
    console.log(params)
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(["EachPhotoDetails"], () => {
        return fetchEachPhotoDetails(params.EachPhoto)
    });
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};
