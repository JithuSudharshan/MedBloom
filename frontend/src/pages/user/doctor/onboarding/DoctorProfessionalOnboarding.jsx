import { useDoctorProfessionalInfo } from "../../../../hooks/useDoctorProffesional";
import DoctorProfessionalForm from "../../../../components/form/DoctorProffesionalForm";

export default function DoctorOnboardingForm() {
    const {
        register,
        handleSubmit,
        onSubmit,
        setValue,
        watch,
        errors,
        isSubmitting,
        submitError,
    } = useDoctorProfessionalInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 py-12 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl mt-20 shadow-lg p-10">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-gray-900">MED</span>
                        <span className="text-teal-500">BLOOM</span>
                    </h1>
                    <p className="text-teal-600 text-lg font-medium">
                        Doctor Proffesional Information
                    </p>
                </div>

                {/* Progress Tracker */}
                <div className="flex items-center justify-center mb-10">
                    <div className="flex items-center w-full max-w-md">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-teal-400 text-teal-500 font-semibold bg-white">
                                1
                            </div>
                            <span className="mt-1 text-xs text-teal-700 font-medium">
                                Basic Info
                            </span>
                        </div>
                        {/* Line between steps */}
                        <div className="flex-1 flex items-center mx-2">
                            <div className="w-full h-1 bg-teal-500" />
                        </div>

                        {/* Step 2 */}

                        <div className="flex flex-col items-center">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-500 text-white font-semibold">
                                2
                            </div>
                            <span className="mt-1 text-xs text-teal-700 font-medium">
                                Professional Info
                            </span>
                        </div>
                    </div>
                </div>
                <DoctorProfessionalForm
                    mode="onboarding"
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            </div>
        </div>

    );
}
