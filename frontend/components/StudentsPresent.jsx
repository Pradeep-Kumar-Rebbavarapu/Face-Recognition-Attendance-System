import React from 'react'

export default function StudentsPresent({ ele }) {
    return (
        <div>
            <main>

                <figure className="wrapper !invert !p-0 md:!mx-20 !my-0 border-2 border-gray-400 h-[500px] overflow-y-scroll">
                    <table>

                        <thead>
                            <tr>
                                <th scope="col">Roll Numbers</th>
                                <th scope="col">Name</th>
                                <th scope="col">Branch</th>
                                <th scope="col">Course</th>
                                <th scope="col">Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ele.map((student, index) => {
                                return (
                                    <tr key={student.id}>
                                        <th scope="row">{student?.roll_number}</th>
                                        <td>{student?.name}</td>
                                        <td>{student?.branch}</td>
                                        <td>{student?.course}</td>
                                        <td>{student?.year}</td>
                                    </tr>
                                )
                            })}


                        </tbody>
                        
                    </table>
                </figure>

            </main>
            <style jsx>
                {`
                    * {
                        box-sizing: border-box;
                      }
                      
                      body {
                        --page-gutter: clamp(1rem, 4vw, 2rem);
                        font-family: system-ui, sans-serif;
                        line-height: 1.4;
                        margin: 0;
                      }
                      
                      main {
                        inline-size: min(60rem, 100% - var(--page-gutter) * 2);
                        margin: 4rem auto;
                      }
                      
                      .wrapper {
                        display: flex;
                        overscroll-behavior-x: contain;
                        overflow-x: auto;
                        margin-inline: calc(var(--page-gutter) * -1);
                        padding-inline: var(--page-gutter);
                        padding-block: 1rem;
                      }
                      
                      h1 {
                        line-height: 1.2;
                      }
                      
                      table {
                        border-spacing: 0;
                        overflow: hidden;
                        inline-size: 100%;
                        text-align: left;
                        background-color: inherit;
                        border: 1px solid lightgray;
                        border-radius: 0.5rem;
                        box-shadow: 0px 4px 6px -2px rgba(14, 30, 37, 0.12);
                      }
                      
                      :is(th, td) {
                        padding: 1rem;
                        min-inline-size: 10rem;
                        border-block-end: 1px solid lightgray;
                      }
                      
                      tfoot :is(th, td) {
                        border-block-end: unset;
                      }
                      
                      tfoot tr {
                        background-color: whitesmoke;
                      }
                      
                      :is(th, td):not(:first-child) {
                        border-inline-start: 1px solid lightgray;
                      }
                      
                      .visually-hidden {
                        clip: rect(0 0 0 0);
                        clip-path: inset(50%);
                        height: 1px;
                        overflow: hidden;
                        position: absolute;
                        white-space: nowrap;
                        width: 1px;
                      }
                      
                `}
            </style>
        </div>
    )
}
