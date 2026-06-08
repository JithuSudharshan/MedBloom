import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/landing page/Navbar'
import ReviewDetails from '../../../components/profile/admin/doctorProfile/ReviewDetails'
import { useNavigate, useParams } from 'react-router-dom'
import { acceptDoctor, FetchDoctorInfoForReview, rejectDoctor } from '../../../api/adminApi'
import Loader from '../../../components/ui/Loading'
import { showToast } from '../../../components/ui/Toast'


const ApplicationReviewPage = () => {

    const { doctorId } = useParams()
    const [doctorInfo, setDoctorInfo] = useState(null)
    const navigate = useNavigate()

    const DoctorInfoForReview = async (doctorId) => {
        try {
            const response = await FetchDoctorInfoForReview(doctorId)
            if (!response?.data?.success) return
            const data = response?.data?.details
            setDoctorInfo(data)
        } catch (error) {
            console.log("something went wrong while fetching doctor details for reviewing application")
        }
    }

    useEffect(() => {
        DoctorInfoForReview(doctorId)
    }, [])

    const handleApprove = async (id) => {
        const response = await acceptDoctor(id)
        if (!response?.data?.success)
            return showToast.error(`${response?.data?.message}`)
        navigate("/admin/dashboard")
        showToast.success("Doctor Profile has been Approved")
    }

    const handleReject = async (id) => {
        const response = await rejectDoctor(id)
        if (!response?.data?.success)
            return showToast.error(`${response?.data?.message}`)
        navigate("/admin/dashboard")
        showToast.success("Doctor Profile has been Rejected")

    }

    if (doctorInfo === null) return <Loader />

    return (
        <>
            <Navbar />
            <ReviewDetails
                doctorId={doctorId}
                doctorDetails={doctorInfo}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </>
    )
}

export default ApplicationReviewPage