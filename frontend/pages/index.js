import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import homepage1 from '../public/images/homepage1.jpeg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Model from "@/components/Model";
import { NextSeo } from 'next-seo';
export default function Home() {
	
	return (
		<div className="  h-screen backdrop-blur-2xl  ">
			<NextSeo
				title="IIT INDORE - ATTENDANCE"
				description="IIT INDORE'S ATTENDANCE SYSTEM"
			/>

			<div className="w-full h-full backdrop-blur-2xl   lg:my-auto flex justify-center items-center absolute z-[1] overflow-hidden">
				<Model />
			</div>
			<div className="  flex  justify-center items-center overflow-hidden pt-20">
				<div className="!z-[1]  w-full flex items-center justify-center mx-auto  my-auto h-screen overflow-hidden">
					<div className="md:text-5xl text-3xl backdrop-blur-3xl rounded-lg font-bold  my-20  text-white p-20  text-center w-full">Face Recognition Attendance System</div>
				</div>
				
			</div>
			
		</div>
	);
}


