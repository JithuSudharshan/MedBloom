export const genderOptions = [
    { label: "Female", value: "female" },
    { label: "Male", value: "male" },
    { label: "Other", value: "other" }
];

export const basicFields = [
    {
        type: "file",
        name: "profilePicture",
        label: "Profile Picture",
        showIn: ["onboarding"]
    },
    {
        type: "input",
        name: "displayName",
        label: "Display Name",
        inputType: "text",
        placeholder: "Dr. Jayalekshmi Vasudev",
        showIn: ["onboarding", "edit"]
    },
    {
        type: "radio",
        name: "gender",
        label: "Gender",
        options: genderOptions,
        showIn: ["onboarding", "edit"]
    },
    {
        type: "input",
        name: "contactNumber",
        label: "Contact Number",
        inputType: "tel",
        placeholder: "Enter a phone number",
        showIn: ["onboarding", "edit"]
    },
    {
        type: "date",
        name: "dateOfBirth",
        label: "Date Of Birth",
        showIn: ["onboarding"]
    },
    {
        type: "input",
        name: "location",
        label: "Clinic/Hospital location",
        inputType: "text",
        placeholder: "City / Area",
        showIn: ["onboarding", "edit"]
    },
    {
        type: "textarea",
        name: "shortBio",
        label: "Short Bio",
        rows: 4,
        placeholder: "Tell us about yourself...",
        showIn: ["onboarding", "edit"]
    },
    {
        type: "select",
        name: "consultationMode",
        label: "Consultation Mode",
        options: [
            { label: "Online", value: "online" },
            { label: "Offline", value: "offline" },
            { label: "Both", value: "both" },
        ],
        showIn: ["edit"]
    }
];

export const professionalFields = [
    {
        type: "file",
        name: "certificate",
        label: "Medical Council Registration / Licence Certificate",
        showIn: ["onboarding"]
    },
    {
        type: "select",
        name: "primarySpecialization",
        label: "Primary Specialization",
        options: [
            { label: "cardiology", value: "1" },
            { label: "orthology", value: "2" },
            { label: "gynocology", value: "3" },
            { label: "ophthalmology", value: "4" },
        ],
        showIn: ["onboarding"]
    },
    {
        type: "input",
        name: "subSpecializations",
        label: "Sub Specializations (if any)",
        inputType: "text",
        placeholder: "e.g., Interventional Cardiology",
        showIn: ["onboarding"]
    },
    {
        type: "select",
        name: "yearOfExperience",
        label: "Years of experience",
        options: [
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "6", value: "6" },
            { label: "7", value: "7" },
            { label: "8", value: "8" },
            { label: "9", value: "9" },
            { label: "10+", value: "10+" },
        ],
        showIn: ["onboarding"]
    },
    {
        type: "input",
        name: "medicalRegistrationNumber",
        label: "Medical Registration Number",
        inputType: "text",
        placeholder: "Enter your registration number",
        showIn: ["onboarding"]
    },
    {
        type: "input",
        name: "issuingCouncil",
        label: "Issuing Council",
        inputType: "text",
        placeholder: "e.g., State Medical Council",
        showIn: ["onboarding"]
    },
    {
        type: "input",
        name: "licenseNumber",
        label: "License Number",
        inputType: "text",
        placeholder: "Enter your license number",
        showIn: ["onboarding"]
    },
    {
        type: "textarea",
        name: "clinicAddress",
        label: "Clinic Address",
        rows: 4,
        placeholder: "Enter clinic address",
        showIn: ["onboarding", "edit"]
    },
    {
        type: "select",
        name: "consultationMode",
        label: "Consultation Mode",
        options: [
            { label: "Online", value: "online" },
            { label: "Offline", value: "offline" },
            { label: "Both", value: "both" },
        ],
        showIn: ["onboarding", "edit"]
    }
];
