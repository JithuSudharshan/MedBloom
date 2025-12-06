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
        label: "Full Name",
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
        showIn: ["onboarding", "edit", "edit"]
    },
    {
        type: "date",
        name: "dateOfBirth",
        label: "Date Of Birth",
        showIn: ["onboarding", "edit"]
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
];

export const professionalFields = [
    {
        type: "file",
        name: "certificate",
        label: "Medical Council Registration / Licence Certificate",
        showIn: ["onboarding"]
    },
    {
        type: "input",
        name: "primarySpecialization",
        label: "Primary Specialization",
        inputType: "text",
        placeholder: "e.g., Cardiology",
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
        showIn: ["onboarding"]
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
        showIn: ["onboarding"]
    }
];
