"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Photo() {
    return (
        <div className=" w-full h-full relative">
            <motion.div
                initial={{opacity: 0}}
                animate={{
                    opacity:1,
                    transition:{ delay: 1, duration: 0.4, ease: "easeIn"}
                }}
                className=" mt-8 xl:mt-0"
            >
                {/* image */}
                <motion.div
                     initial={{opacity: 0}}
                     animate={{
                         opacity:1,
                         transition:{ delay: 2.4, duration: 0.4, ease: "easeInOut"},
                     }}
                    className=" w-[298px] h-[298px] absolute"
                >
                    <Image
                        src={"/assets/photo.png"}
                        priority
                        quality={100}
                        fill
                        alt=""
                        className=" object-contain"
                    />
                </motion.div>

                {/* circle */}
                <motion.svg
                    className={" w-[300px] h-[300px]"}
                    fill={"transparent"}
                    viewBox={"0 0 506 506"}
                    xmlns={"http://www.w3.org/2000/svg"}
                >
                    <motion.circle
                        cx={"253"}
                        cy={"253"}
                        r={"250"}
                        stroke={"#4f772d"}
                        strokeWidth={"4"}
                        strokeLinecap={"round"}
                        strokeLinejoin={"round"}
                        initial={{ strokeDasharray: "24 10 0 0"}}
                        animate={{
                            strokeDasharray: ["15, 120, 25, 25", "16 25 92 72", "4 250 22 22"],
                            rotate: [120, 360],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                    />
                </motion.svg>
            </motion.div>
        </div>
    )
}
