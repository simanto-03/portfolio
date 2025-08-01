"use client";

import React from 'react'
import CountUp from 'react-countup';

const stats = [
    {
        num: 4,
        text: "Years of Experience",
    },
    {
        num: 4,
        text: "Projects Done",
    },
    {
        num: 4,
        text: "Publications",
    },
    {
        num: 4,
        text: "Technology Mastered",
    }
]

export default function Stats() {
    return (
        <section>
            <div className=' container mx-auto'>
                <div className=' flex flex-wrap gap-6 max-w-[80vw] mx-auto xl:max-w-none'>
                    {stats.map((stat, index) => {
                        return (
                            <div key={index} className=' flex-1 flex gap-4 items-center justify-center xl:justify-start'>
                                <CountUp
                                    end={stat.num}
                                    duration={2}
                                    delay={1.5}
                                    className=' text-4xl xl:text-6xl font-extrabold' 
                                />
                                <p 
                                    className={`${stat.text.length <15 ? " max-w-[100px]":" max-w-[150px]"}
                                     leading-snug text-bgDark dark:text-bgLight`}
                                >
                                    {stat.text}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
