import React from 'react'
import { NextSeo } from 'next-seo';
import pradeep from '../public/images/pradeep.jpg'
import akhilesh from '../public/images/akhilesh.jpeg'
import vijit from '../public/images/vijit.jpeg'
import Image from 'next/image';
export default function AboutUsPage() {
    return (
        <div>
            <NextSeo
                title="IIT INDORE - ATTENDANCE"
                description="IIT INDORE'S ATTENDANCE SYSTEM"
            />
            <div>
                <section className="text-gray-600 body-font invert">
                    <div className="container px-5 pt-24 mx-auto">
                        <div className="flex flex-col text-center w-full mb-20">
                            <h1 className="text-2xl font-medium title-font mb-4 text-gray-900 tracking-widest">OUR TEAM</h1>
                            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">This project was developed under the guidance of Professor Chandresh Kumar Maurya as a course assignment. Its inception stemmed from the need to streamline and expedite the attendance tracking process.</p>
                        </div>
                        <div className="flex flex-wrap -m-4 justify-center">
                            <div className="p-4 mx-auto max-w-[800px] mb-10">
                                <div className="h-full flex lg:flex-col flex-col items-center  justify-center text-center sm:text-center">
                                    <div className='flex w-full justify-center '>
                                    <Image placeholder='blur' alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 invert mb-4 mx-auto translate-x-[20px]" src={pradeep}/></div>
                                        <div className="flex-grow sm:pl-8">
                                            <h2 className="title-font font-medium text-lg text-gray-900 mt-5">Pradeep Kumar Rebbavarapu</h2>
                                            <h3 className="text-gray-500 mb-3">IIT INDORE</h3>
                                            <p className="mb-4">I am presently in the second year of my academic journey, where I am diligently working towards the attainment of a Bachelor of Technology (B.Tech) degree..</p>
                                            <span className="inline-flex">
                                                <a className="text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                                    </svg>
                                                </a>
                                                <a className="ml-2 text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                                    </svg>
                                                </a>
                                                <a className="ml-2 text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                                    </svg>
                                                </a>
                                            </span>
                                        </div>
                                </div>
                            </div>
                            <div className='grid lg:grid-cols-2'>
                            <div className="p-4 my-10">
                                <div className="h-full flex  sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                                    <Image placeholder='blur' alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4 invert" src={akhilesh}/>
                                        <div className="flex-grow sm:pl-8">
                                            <h2 className="title-font font-medium text-lg text-gray-900">Akhilesh Panchangam</h2>
                                            <h3 className="text-gray-500 mb-3">IIT INDORE</h3>
                                            <p className="mb-4">I am presently in the second year of my academic journey, where I am diligently working towards the attainment of a Bachelor of Technology (B.Tech) degree..</p>
                                            <span className="inline-flex">
                                                <a className="text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                                    </svg>
                                                </a>
                                                <a className="ml-2 text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                                    </svg>
                                                </a>
                                                <a className="ml-2 text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                                    </svg>
                                                </a>
                                            </span>
                                        </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                                    <Image placeholder="blur" alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4 invert" src={vijit}/>
                                        <div className="flex-grow sm:pl-8">
                                            <h2 className="title-font font-medium text-lg text-gray-900">Vijit Balsori</h2>
                                            <h3 className="text-gray-500 mb-3">IIT INDORE</h3>
                                            <p className="mb-4">I am presently in the second year of my academic journey, where I am diligently working towards the attainment of a Bachelor of Technology (B.Tech) degree..</p>
                                            <span className="inline-flex">
                                                <a className="text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                                    </svg>
                                                </a>
                                                <a className="ml-2 text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                                    </svg>
                                                </a>
                                                <a className="ml-2 text-gray-500">
                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                                    </svg>
                                                </a>
                                            </span>
                                        </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
