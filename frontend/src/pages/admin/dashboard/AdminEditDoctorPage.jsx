import React from 'react'
import EditDoctorProfilePage from '../../user/doctor/EditDoctorProflePage'
import { useParams } from 'react-router-dom';

const AdminEditDoctorPage = () => {
    const { doctorId } = useParams();

    return (
        <div>
            <EditDoctorProfilePage isAdmin={true} doctorId={doctorId} />
        </div>
    )
}

export default AdminEditDoctorPage