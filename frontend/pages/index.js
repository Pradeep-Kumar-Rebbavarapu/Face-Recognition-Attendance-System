import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [id, setid] = useState(1);
	const [total, settotal] = useState(0);
	const [students, setstudents] = useState([]);
	const [file, setfile] = useState(null);
	console.log("students", students);
	console.log("total", total);
	const [btn1, setbtn1] = useState(false);
	const [btn2, setbtn2] = useState(true);
	const [btn3, setbtn3] = useState(true);
	const [btn4, setbtn4] = useState(true);
	const [loading,setloading] = useState(false)
	return (
		<main
			className={`flex justify-center items-center flex-col `}
		>
			<input
				id="file"
				name="file"
				type="file"
				className="my-10 border-2"
				onChange={(e) => {
					setbtn1(false)
					setbtn2(true)
					setbtn3(true)
					setbtn4(true)
					setstudents([])
					settotal(0)
					setid(1)
					document.querySelectorAll('button').forEach((e)=>{
						e.innerHTML = "Send"
					})
					setfile(e.target.files);
				}}
			/>
			<div className="lg:flex">
				<div className="mx-5">
					<button
						id="1"
						disabled={btn1 || !file}
						className="border-2 border-white p-2 mx-2 my-2 lg:my-0"
						onClick={() => {
							let formData = new FormData();
							formData.append("id", 1);
							formData.append("file", file[0]);
							sendPhoto(
								students,
								total,
								setstudents,
								settotal,
								1,
								file,
								setid,
								formData,
								setbtn1,
								setbtn2
							);
						}}
					>
						Send
					</button>
					<span>Roll Number 1 - 20</span>
				</div>
				<div className="mx-5">
					<button
						id="2"
						disabled={btn2 || !file}
						className="border-2 border-white p-2 mx-2 my-2 lg:my-0"
						onClick={() => {
							let formData = new FormData();
							formData.append("id", 2);
							formData.append("file", file[0]);
							sendPhoto(
								students,
								total,
								setstudents,
								settotal,
								2,
								file,
								setid,
								formData,
								setbtn2,
								setbtn3
							);
						}}
					>
						Send
					</button>
					<span>Roll Number 20 - 40</span>
				</div>
				<div className="mx-5">
					<button
						id="3"
						disabled={btn3 || !file}
						className="border-2 border-white p-2 mx-2 my-2 lg:my-0"
						onClick={() => {
							let formData = new FormData();
							formData.append("id", 3);
							formData.append("file", file[0]);
							sendPhoto(
								students,
								total,
								setstudents,
								settotal,
								3,
								file,
								setid,
								formData,
								setbtn3,
								setbtn4
							);
						}}
					>
						Send
					</button>
					<span>Roll Number 40 - 60</span>
				</div>
				<div className="mx-5">
					<button
						id="4"
						disabled={btn4 || !file}
						className="border-2 border-white p-2 mx-2 my-2 lg:my-0"
						onClick={() => {
							let formData = new FormData();
							formData.append("id", 4);
							formData.append("file", file[0]);
							sendPhoto(
								students,
								total,
								setstudents,
								settotal,
								4,
								file,
								setid,
								formData,
								setbtn4,
								() => { }
							);
						}}
					>
						Send
					</button>
					<span>Roll Number 60+</span>
				</div>
				
			</div>
			<div>
				{students.length!==0 && total!=0 && (
					<div className="text-center my-10 text-lg lg:text-3xl font-bold">Students Present In The Photo : {total}</div>
				)}
					<div className="grid grid-cols-2 mx-2 my-10 sm:grid-cols-5 xl:grid-cols-10">
					{students.map((ele) => {
						return <div className="border-2 border-white p-2 mx-2 my-2" key={ele}>{ele}</div>;
					})}
					</div>
				</div>
		</main>
	);
}

const sendPhoto = (
	students,
	total,
	setstudents,
	settotal,
	id,
	file,
	setid,
	formData,
	previous_btn,
	next_btn,
) => {
	document.getElementById(id).innerHTML = "loading..."
	axios
		.post("http://20.212.192.239/api/v1/GroupPhotoAPI/", formData)
		.then((response) => {
			console.log(response);
			setstudents((oldstudents) =>
				oldstudents.concat(response.data.students).sort()
			);
			settotal((total) => total + response.data.total_students);
			document.getElementById(id).innerHTML = "Done"
			previous_btn(true);
			next_btn(false);
		}).catch((err)=>{
			document.getElementById(id).innerHTML = "Error"
		})
};
