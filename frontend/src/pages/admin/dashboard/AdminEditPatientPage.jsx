import React from 'react'
import EditPatientProfilePage from '../../user/patient/EditPatientProfilePage'
import { useParams } from 'react-router-dom';

const AdminEditPatientPage = () => {
    const { patientId } = useParams();
    return (
        <>
            <EditPatientProfilePage isAdmin={true} patientId={patientId} />
        </>
    )
}

export default AdminEditPatientPage