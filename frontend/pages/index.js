import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import homepage1 from '../public/images/homepage1.jpeg'
export default function index() {
	const [image, setimage] = useState(null);
	const [course, setcourse] = useState('CS 203');
	const [date, setdate] = useState(null);
	return (
		<div className="lg:grid lg:grid-cols-[80px_auto_auto]  h-full">
			<div className="hidden lg:block"></div>
			<div className="w-full h-full lg:py-10 pt-20 lg:my-auto flex justify-center items-center">
				<Image src={homepage1} placeholder="blur" className="w-[300px] sm:w-[500px]  lg:-skew-x-12 lg:translate-x-10" />
			</div>
			<div className="lg:hidden"></div>
			<div className="flex flex-col justify-center items-center w-full h-full  text-white">
				<div className=" px-5 py-20 mx-auto flex">
					<div className="max-w-[400px] bg-white rounded-lg p-8 flex flex-col md:ml-auto  mt-10 md:mt-0 relative z-10 shadow-md">
						<h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Collect Attendance</h2>
						<p className="leading-relaxed mb-5 text-gray-600">Submit the class photo along with the course name and the date of the course taken.</p>
						<div className="relative mb-4">
							<label for="course" className="leading-7 text-sm text-gray-600">Course</label>
							<select type="select" id="course" name="course" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required onChange={(e)=>{
								console.log(e)
								setcourse(e.target.value)
							}}>
								<option>CS 203</option>
								<option>MA 205</option>
								<option>CS 207</option>
								<option>CS 201</option>
							</select>
						</div>
						<div className="relative mb-4">
							<label for="date" className="leading-7 text-sm text-gray-600">Date of the class Taken</label>
							<input onChange={(e)=>{
								setdate(e.target.value)
							}} id="date" name="date" type="date" placeholder="Date of the Class Taken" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required />
						</div>
						<div className="relative mb-4">
							<label for="file" className="leading-7 text-sm text-gray-600">Class Photo</label>
							<input
								type="file"
								onChange={(e) => {
									setimage(e.target.files);
								}}
								className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
								name="file"
								id="file"
								required
							/>
						</div>
						<button
						disabled={!image && !course && !date}
							className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
							onClick={() => {
								let formData = new FormData();
								formData.append("file", image[0]);
								formData.append('date',date)
								formData.append('course',course)
								sendPhoto(formData);
							}}
						>
							Send
						</button>

						<p className="text-xs text-gray-500 mt-3">MAKE SURE EVERY PERSON IN THE PHOTO IS CLEARLY VISIBLE ELSE HE/SHE MAY NOT BE CONSIDERED . YOU CAN ALSO DIVIDE THE PICTURE INTO GROUPS OF STUDENTS.</p>
					</div>
				</div>
				{/* 
				 */}
			</div>
		</div>
	);
}

const sendPhoto = (formData) => {
	axios
		.post("http://127.0.0.1:8000/api/v1/GroupPhotoAPI/", formData)
		.then((response) => {
			console.log(response);
		})
		.catch((err) => {
			alert(err.toString());
		});
};
