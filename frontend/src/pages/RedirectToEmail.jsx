import React from 'react'
import LeftHero from '../components/layout/LeftHero'
import RightRedirectVerifyEmail from '../components/layout/RightRedirectVerifyEmail'
import heroImg from "../assets/hero-illustration.png";


const RedirectToEmail = () => {
    return (
        <div className='flex h-screen'>
            <LeftHero imgSrc={heroImg} sentence={"Create an account to book appointments, access medical records, and connect with healthcare professionals."} />
            <RightRedirectVerifyEmail />
        </div>
    )
}

export default RedirectToEmail