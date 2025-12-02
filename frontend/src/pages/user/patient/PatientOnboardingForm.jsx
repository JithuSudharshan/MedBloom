import { usePatientOnboarding } from "../../../hooks/UsePatientOnboarding";
import PatientForm from "../../../components/profile/PatientForm";

export default function PatientOnboardingForm() {
    const {
        register,
        handleSubmit,
        onSubmit,
        setValue,
        errors,
        isSubmitting,
        submitError,
    } = usePatientOnboarding();

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 py-12 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl mt-20 shadow-lg p-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-gray-900">MED</span>
                        <span className="text-teal-500">BLOOM</span>
                    </h1>
                    <p className="text-teal-600 text-lg font-medium">
                        Personal &amp; Medical informations
                    </p>
                </div>

                <PatientForm
                    mode="onboarding"
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    setValue={setValue}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            </div>
        </div>
    );
}
