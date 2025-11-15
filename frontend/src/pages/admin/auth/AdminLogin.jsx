import React, { useState } from 'react'
import LeftHero from '../../../components/layout/LeftHero'
import AuthCard from '../../../components/layout/AuthCard'

const AdminLogin = () => {
    const [role, setRole] = useState("Patient")

    return (
        <div className='flex h-screen'>
            <LeftHero imgSize={"w-1/2"} sentence={"Authorized admin access only. Sign in to securely manage all appointment and scheduling data."} isLottie={true} />
            <AuthCard isAdmin={true} oneLine={"Sign in with you admin credentials"} onChange={setRole} authState={"login"} />
        </div>
    )
}

export default AdminLogin