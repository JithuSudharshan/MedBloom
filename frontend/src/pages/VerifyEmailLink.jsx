import React from 'react'
import LeftHero from '../components/layout/LeftHero'
import RightVerifyEmail from '../components/layout/RightVerifyEmail'
import heroImg from "../assets/hero-illustration.png";


const VerifyEmailLink = () => {
    return (
        <div className='flex h-screen'>
            <LeftHero imgSrc={heroImg} sentence={"Create an account to book appointments, access medical records, and connect with healthcare professionals."} />
            <RightVerifyEmail />
        </div>
    )
}

export default VerifyEmailLink