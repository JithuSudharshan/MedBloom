import { useEffect, useState } from "react";
import Loader from "../../../components/ui/Loading";
import { loadDoctorData } from "../../../api/doctorApi";
import DoctorBasicForm from "../../../components/form/DoctorBasicForm";
import { useEditDoctorProfile } from "../../../hooks/useEditDoctorProfile";
import { loadDoctorDataForAdmin } from "../../../api/adminApi";

export default function EditDoctorProfilePage({ isAdmin = false, doctorId }) {

    const [doctor, setDoctor] = useState(null)

    const {
        register,
        handleSubmit,
        control,
        setValue,
        errors,
        onSubmit,
        isSubmitting,
    } = useEditDoctorProfile(doctor, { isAdmin, doctorId });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = isAdmin
                    ? await loadDoctorDataForAdmin(doctorId)
                    :
                    await loadDoctorData();

                setDoctor(response?.data?.details || null);
            } catch (err) {
                console.error("Failed to load doctor data:", err);
                setDoctor(null);
            }
        };

        fetchDoctor();
    }, [isAdmin]);

    if (doctor === null) return <Loader />

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-2xl mt-10 shadow-lg p-10">

            <h2 className="text-2xl font-semibold text-[#6B3B3D] mb-6">
                Edit Profile
            </h2>

            <DoctorBasicForm
                isAdmin={true}
                doctorId={doctorId}
                mode="edit"
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                setValue={setValue}
                errors={errors}
                isSubmitting={isSubmitting}
                submitError={null}
                control={control}
            />
        </div>
    )
}
