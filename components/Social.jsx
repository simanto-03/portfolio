import React from 'react'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter} from "react-icons/fa"

const socials = [
    { icon: <FaGithub />, path:""},
    { icon: <FaLinkedin />, path:""},
    { icon: <FaFacebook />, path:""},
    { icon: <FaTwitter />, path:""},
]

export default function Social({ containerStyles, iconStyles }) {
    return (
        <div className={containerStyles}>
            {socials.map((social, index) => {
                return (
                    <Link key={index} href={social.path} className={iconStyles}>
                        {social.icon}
                    </Link>
                )
            })}
        </div>
    )
}
