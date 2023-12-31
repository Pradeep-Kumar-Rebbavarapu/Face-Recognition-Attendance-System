import React from 'react'

export default function EachPhotoComp({ ele }) {
    return (
        <div>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 pt-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 invert">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest"></h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">{ele.course} - {ele.course_taken_on}</h1>

                            <p className="leading-relaxed mb-4">The uploaded image has successfully passed our validation process, meeting our stringent quality standards.

                                Should you have any questions or require assistance, please don&apos;t hesitate to use our contact section.

                                We kindly request clear and high-quality class photos for accurate student identification, ensuring the efficiency of our system. Your cooperation is greatly appreciated.</p>
                            <div className="flex border-t border-gray-200 py-2">
                                <span className="text-gray-500">Total Students Present</span>
                                <span className="ml-auto text-gray-900">{ele.total_students}</span>
                            </div>
                            <div className="flex border-t border-gray-200 py-2">
                                <span className="text-gray-500">Date and Time of Computation</span>
                                <span className="ml-auto text-gray-900">{ele.date_of_validation}  {ele.time_of_validation}</span>
                            </div>
                            <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                                <span className="text-gray-500">Lecture of {ele.course} taken on</span>
                                <span className="ml-auto text-gray-900">{ele.course_taken_on}</span>
                            </div>
                            <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                                <span className="text-gray-500">Status</span>
                                <span className="ml-auto text-gray-900">{ele.status}</span>
                            </div>
                        </div>
                        <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={ele.image} />
                    </div>
                </div>
            </section>
        </div>
    )
}
