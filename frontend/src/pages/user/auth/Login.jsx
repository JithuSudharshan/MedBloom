import React, { useState } from 'react'
import LeftHero from '../../../components/layout/LeftHero'
import patientImg from '../../../assets/images/patientLogin.png'
import doctorImg from '../../../assets/images/doctorLogin.png'
import AuthCard from '../../../components/layout/AuthCard'

const Login = () => {
    const [role, setRole] = useState("Patient")

    return (
        <div className='flex h-screen'>
            <LeftHero imgSrc={role === 'Patient' ? patientImg : doctorImg} imgSize={"w-1/2"} headLine={"Healthcare made simple"} sentence={role === "Patient" ? "Log in to book appointments, view your health records, and stay connected with your doctors." : "Log in to manage your appointments, connect with patients, and provide the best care with ease."} role={role} />
            <AuthCard oneLine={"Sign in to your account to continue"} onChange={setRole} authState={"login"} />
        </div>
    )
}

export default Login