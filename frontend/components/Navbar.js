import Link from 'next/link'
import React from 'react'
import logo from '../public/images/logo.png'
import Image from 'next/image'
export default function Navbar() {
  return (
    <header className="text-gray-900 body-font bg-white fixed z-[100] w-full ">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <Image src={logo} placeholder='blur' className='w-10 h-10' />
           
          <span className="ml-3 text-xl">IIT INDORE</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/" className="mr-5 hover:text-black hover:font-bold font-semibold hover:scale-105 transition-all fade-in-out ">Home</Link>
          <Link href="/CoursesPage" className="mr-5 hover:text-black hover:font-bold font-semibold hover:scale-105 transition-all fade-in-out ">Courses</Link>
          <Link href="/ContactUsPage" className="mr-5 hover:text-black hover:font-bold font-semibold hover:scale-105 transition-all fade-in-out ">Contact Us</Link>
          <Link href="/AboutUsPage" className=" hover:text-black hover:font-bold font-semibold hover:scale-105 transition-all fade-in-out ">About Us</Link>
        </nav>
      </div>
    </header>
  )
}
