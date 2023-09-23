import Navbar from '@/components/Navbar'
import '../styles/globals.css'
import { useEffect, useRef } from 'react'
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
  } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function App({ Component, pageProps }) {
		const queryClient = new QueryClient()
		const ref = useRef();
		useEffect(() => {
			const handleClicKOutsideOffcanvas = (e) => {
				if (ref.current && ref.current.contains(e.target)) {
					if(document.getElementById('navbar').classList.contains('left-[-100px]')){
						document.getElementById("navbar").className = "bg-gradient-to-l top-0  to-indigo-500 from-violet-500 left-0 h-full  transition-all fade-in-out absolute z-[1000] ";
						document.getElementById("navbtn").className = 'w-[100px] h-[50px] bg-gradient-to-r lg:hidden to-indigo-500 from-violet-500 bg-gradient-to-l  to-indigo-500 from-violet-500 top-[100px] left-[80px] absolute transition-all fade-in-out';
						
					}
					else{
						document.getElementById("navbar").className = "bg-gradient-to-l top-0  to-indigo-500 from-violet-500 lg:left-0 h-full  transition-all fade-in-out absolute z-[1000] left-[-100px]";
						document.getElementById("navbtn").className = "w-[100px] h-[50px] bg-gradient-to-r lg:hidden to-indigo-500 from-violet-500 top-[100px] left-[0px] absolute transition-all fade-in-out ";
					}
					
				}
			};
			document.addEventListener("click", handleClicKOutsideOffcanvas, true);
			return () => {
				document.removeEventListener(
					"click",
					handleClicKOutsideOffcanvas,
					true
				);
			};
		}, []);
	
	return (
		<div >
			 <QueryClientProvider client={queryClient} >
			<div className='relative'>
				<div className='transition-all fade-in-out'>
					<div className='text-center  p-5 uppercase font-bold md:text-2xl text-xl lg:text-3xl  text-white bg-gradient-to-r from-violet-500 z-[0]  to-indigo-500 '>Face Recognition Attendance System</div>
					<Navbar/>
					<button ref={ref} id="navbtn" className='w-[100px] h-[50px] bg-gradient-to-r  to-indigo-500 lg:hidden from-violet-500 top-[100px]  absolute transition-all fade-in-out '>
					
					</button>
				</div>
				
				<div className='lg:grid lg:grid-cols-[80px_auto]'>
				<div className="hidden lg:block"></div>
				<Component {...pageProps} />
				</div>
			</div>
			<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</div>
	)
}


