import Input from '../../../components/form/Input';
import Button from '../../../components/ui/Button';
import RadioGroup from './../../../components/form/RadioGroup';
import TextArea from './../../../components/form/TextArea';
import Select from './../../../components/form/Select';
import DatePicker from './../../../components/form/DatePicker';
import FileUpload from './../../../components/form/FileUpload';
import { usePatientOnboarding } from '../../../hooks/UsePatientOnboarding';

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

    const genderOptions = [
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' },
        { label: 'Intersex', value: 'intersex' },
        { label: 'Prefer not to say / other', value: 'other' },
    ]

    const DrinkingOptions = [
        { label: 'Never', value: 'Never' },
        { label: 'Quit drinking', value: 'Quit drinking' },
        { label: 'Occasionally (social/rarely)', value: 'Occasionally (social/rarely)' },
        { label: 'Yes, regularly', value: 'Yes, regularly' },
        { label: 'Yes, but not regularly', value: 'Yes, but not regularly' }
    ]
    const smokingOption = [
        { label: 'Never smoked', value: 'Never smoked' },
        { label: 'Former smoker', value: 'Former smoker' },
        { label: 'Occasionally (social/rarely)', value: 'Occasionally (social/rarely)' },
        { label: 'Yes, daily', value: 'Yes, daily' },
        { label: 'Yes, but not daily', value: 'Yes, but not daily' }
    ]

    const bloodGroupOptions = [
        { label: 'Select blood group', value: '' },
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 py-12 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl mt-20 shadow-lg p-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-gray-900">MED</span>
                        <span className="text-teal-500">BLOOM</span>
                    </h1>
                    <p className="text-teal-600 text-lg font-medium">Personal & Medical informations</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                        {/* Left Column - Basic Details */}
                        <div>
                            <h2 className="text-2xl font-semibold text-teal-700 mb-6">Basic Details</h2>

                            <FileUpload
                                label="Profile Picture"
                                name="profilePicture"
                                register={register}
                                error={errors.profilePicture}
                                setValue={setValue}
                            />

                            <RadioGroup
                                label="Do you smoke?"
                                name="smoking"
                                options={smokingOption}
                                register={register}
                                error={errors.smoking}
                            />

                            <RadioGroup
                                label="Do you drink?"
                                name="drinking"
                                options={DrinkingOptions}
                                register={register}
                                error={errors.drinking}
                            />

                            <Input
                                label="Emergency contact Number"
                                name="emergencyNumber"
                                register={register}
                                error={errors.emergencyNumber}
                                placeholder="Enter a emergency phone number"
                                type="tel"
                            />

                            <DatePicker
                                label="Date Of Birth"
                                name="dateOfBirth"
                                register={register}
                                error={errors.dateOfBirth}
                            />

                            <RadioGroup
                                label="Gender"
                                name="gender"
                                options={genderOptions}
                                register={register}
                                error={errors.gender}
                            />

                            <TextArea
                                label="Address"
                                name="address"
                                register={register}
                                error={errors.address}
                                placeholder="Enter your residential address"
                                rows={4}
                            />
                        </div>

                        {/* Right Column - Medical Information */}
                        <div>
                            <h2 className="text-2xl font-semibold text-teal-700 mb-6">Medical Information</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Blood Type"
                                    name="bloodType"
                                    register={register}
                                    error={errors.bloodType}
                                    placeholder="Select blood type"
                                    options={bloodGroupOptions}
                                />

                                <Input
                                    label="Cholesterol"
                                    name="cholesterol"
                                    register={register}
                                    error={errors.cholesterol}
                                    placeholder="e.g., 120/80 mmHg"
                                    type="text"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Height"
                                    name="height"
                                    register={register}
                                    error={errors.height}
                                    placeholder="e.g., 180 cm"
                                    type="text"
                                />

                                <Input
                                    label="Weight"
                                    name="weight"
                                    register={register}
                                    error={errors.weight}
                                    placeholder="e.g., 65 Kg"
                                    type="text"
                                />
                            </div>

                            <Input
                                label="Blood Pressure"
                                name="bloodPressure"
                                register={register}
                                error={errors.bloodPressure}
                                placeholder="e.g., 120/80 mmHg"
                                type="text"
                            />

                            <Input
                                label="Glucose level"
                                name="glucoseLevel"
                                register={register}
                                error={errors.glucoseLevel}
                                placeholder="e.g., 120/80 mmHg"
                                type="text"
                            />

                            <TextArea
                                label="Allergies"
                                name="allergies"
                                register={register}
                                error={errors.allergies}
                                placeholder="e.g., Penicillin, Peanuts"
                                rows={3}
                            />

                            <TextArea
                                label="Medical Condition"
                                name="medicalCondition"
                                register={register}
                                error={errors.medicalCondition}
                                placeholder="e.g., Asthma, Hypertension"
                                rows={3}
                            />

                            <TextArea
                                label="Food or Drug Intolerances"
                                name="Food_or_Drug_Intolerances"
                                register={register}
                                error={errors.Food_or_Drug_Intolerances}
                                placeholder="e.g., Please list any food (e.g., lactose, gluten) or drug intolerances (e.g., aspirin, penicillin) and describe any known adverse reactions."
                                rows={4}
                            />

                            <TextArea
                                label="Mental Health History"
                                name="Mental_Health_History"
                                register={register}
                                error={errors.Mental_Health_History}
                                placeholder="Please describe any mental health diagnoses, ongoing therapy, or psychiatric medications (confidential)."
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-10">
                        <Button loading={isSubmitting} className='px-10 py-3 hover:bg-teal-600' type="submit" >{isSubmitting ? "Saving..." : "Save and Continue"}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
