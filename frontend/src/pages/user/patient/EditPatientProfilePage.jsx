import { useEffect, useState } from "react";
import PatientForm from "../../../components/profile/PatientForm";
import Loader from "../../../components/ui/Loading";
import { useEditPatientProfile } from "../../../hooks/useEditPatientProfile";
import { loadPatientData } from "../../../api/patientApi";

export default function EditPatientProfilePage() {

    const [patient, setPatient] = useState(null)
    console.log("patient", patient)

    const {
        register,
        handleSubmit,
        setValue,
        errors,
        onSubmit,
        isSubmitting,
    } = useEditPatientProfile(patient);

    useEffect(() => {
        const fetchPatient = async () => {
            const response = await loadPatientData();
            setPatient(response?.data?.details);
        };
        fetchPatient();
    }, []);

    if (patient === null) return <Loader />

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-2xl mt-10 shadow-lg p-10">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                Edit Profile
            </h2>

            <PatientForm
                mode="edit"
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setValue={setValue}
                errors={errors}
                isSubmitting={isSubmitting}
                submitError={null}
            />
        </div>
    )
}
