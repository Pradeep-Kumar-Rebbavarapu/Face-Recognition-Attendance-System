import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function EachCourseCard({ele,course,date}) {
    return (
        <div className='flex justify-center items-center  w-full h-full py-10'>
            <div className="card">
                <div className="card__corner"></div>
                <div className="flex justify-center">
                    <Image src={ele.image} height={100} width={200} className='h-[200px] ' />
                </div>
                <div className="card-int">
                    <p className="card-int__title">{ele.course}</p>
                    <p className="excerpt">Total Students Present : {ele.total_number_of_students}</p>
                    <p className="excerpt">Course Taken On : {ele.date}</p>
                    <p className="excerpt">Computation Done On : <p>{ele.datestamp} - {ele.timestamp}</p></p>
                    <p className="excerpt">Status : <span>{ele.status}</span></p>
                    <Link href={`/CoursesPage/${course}/${date}/${ele.id}`}>
                    <button  className="card-int__button">Show</button>
                    </Link>
                </div>
            </div>
            <style jsx>
                {`
                    .card {
                        width: 275px;
                        position: relative;
                        background: rgb(255, 255, 255);
                        padding: 20px;
                      }
                      
                      .card::after {
                        z-index: -1;
                        content: "";
                        position: absolute;
                        width: 50%;
                        height: 10px;
                        bottom: 15px;
                        right: 0;
                        box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.4);
                        transform: rotate(5deg);
                        transition: all 0.1s ease-in;
                      }
                      
                      .card::before {
                        z-index: -1;
                        content: "";
                        position: absolute;
                        width: 50%;
                        height: 10px;
                        bottom: 15px;
                        left: 0;
                        box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.4);
                        transform: rotate(-5deg);
                        transition: all 0.1s ease-in;
                      }
                      
                      .card:hover:before, .card:hover:after {
                        box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.6);
                      }
                      
                      .card:hover:before {
                        transform: rotate(-8deg);
                      }
                      
                      .card:hover:after {
                        transform: rotate(8deg);
                      }
                      
                      .card__img {
                        object-fit:contain;
                        position: relative;
                        background: #FFFFFF;
                        background: linear-gradient(315deg, #68aeff, #0032a6);
                        width: 100%;
                        height: 100%;
                      }
                      
                      .card__span {
                        cursor: pointer;
                        font-size: 11px;
                        position: absolute;
                        background-color: white;
                        top: 10px;
                        left: 10px;
                        padding: 3px 7px;
                        box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
                        transition: transform 0.1s ease-in;
                        user-select: none;
                      }
                      
                      .card__span:hover {
                        transform: translateX(5px);
                      }
                      
                      .card-int {
                        padding: 20px 0 0 0;
                      }
                      
                      .card-int__title {
                        font-weight: bold;
                        font-size: 1.2rem;
                        font-family: Arial, Helvetica, sans-serif;
                        margin-bottom: 10px;
                      }
                      
                      .card-int__button {
                        cursor: pointer;
                        margin: 20px 0 0 0;
                        padding: 7px 20px;
                        width: 100%;
                        background-color: rgb(238, 246, 255);
                        border: none;
                        color: black;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0);
                        transition: box-shadow 0.1s ease-in;
                        user-select: none;
                      }
                      
                      .card-int__button:active {
                        box-shadow: 0px 0px 15px rgba(0, 119, 255, 0.5);
                      }
                      
                      .card-int__button:hover::before {
                        animation: effect_two 0.4s 1;
                      }
                      
                      .card-int__button::before {
                        content: 'More for this article';
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: absolute;
                        background: rgb(0,133,255);
                        background: linear-gradient(146deg, #0032a6 0%, #68aeff 100%);
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        transform: translateX(-99%);
                        z-index: 1;
                        animation: effect_one 10s infinite;
                      }
                      
                      .card-int__button:hover::before {
                        transform: translateX(0%);
                      }
                      
                      .excerpt {
                        font-size: 14px;
                      }
                      
                      @keyframes effect_one {
                        0% {
                          transform: translateX(-99%);
                        }
                      
                        25% {
                          transform: translateX(-90%);
                        }
                      
                        50% {
                          transform: translateX(-80%);
                        }
                      
                        75% {
                          transform: translateX(-95%);
                        }
                      
                        100% {
                          transform: translateX(-99%);
                        }
                      }
                      
                      @keyframes effect_two {
                        to {
                          transform: translateX(-1%);
                        }
                      
                        from {
                          transform: translateX(-99%);
                        }
                      }
                `}
            </style>
        </div>
    )
}
