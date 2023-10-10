import Link from 'next/link'
import React from 'react'
import { AiFillHome } from 'react-icons/ai'
import { SiGoogleclassroom, SiAboutdotme } from 'react-icons/si'
import { BiSolidContact } from 'react-icons/bi'
export default function Navbar() {
  return (
    <header className="text-gray-900 body-font bg-white fixed z-[100] w-full ">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">IIT INDORE</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/" className="mr-5 hover:text-black hover:font-bold font-semibold hover:scale-105 transition-all fade-in-out ">Home</Link>
          <Link href="/CoursesPage" className="mr-5 hover:text-black hover:font-bold font-semibold hover:scale-105 transition-all fade-in-out ">Courses</Link>
          <Link href="/ContactPage" className="mr-5 hover:text-black hover:font-bold font-semibold hover:scale-105 transition-all fade-in-out ">Contact Us</Link>
          <Link href="/AboutUsPage" className="mr-5 hover:text-black hover:font-bold font-semibold hover:scale-105 transition-all fade-in-out ">About Us</Link>
        </nav>
      </div>
    </header>
  )
}
