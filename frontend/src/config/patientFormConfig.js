
export const genderOptions = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Intersex", value: "intersex" },
  { label: "Prefer not to say / other", value: "other" },
];

export const drinkingOptions = [
  { label: "Never", value: "Never" },
  { label: "Quit drinking", value: "Quit drinking" },
  { label: "Occasionally (social/rarely)", value: "Occasionally (social/rarely)" },
  { label: "Yes, regularly", value: "Yes, regularly" },
  { label: "Yes, but not regularly", value: "Yes, but not regularly" },
];

export const smokingOptions = [
  { label: "Never smoked", value: "Never smoked" },
  { label: "Former smoker", value: "Former smoker" },
  { label: "Occasionally (social/rarely)", value: "Occasionally (social/rarely)" },
  { label: "Yes, daily", value: "Yes, daily" },
  { label: "Yes, but not daily", value: "Yes, but not daily" },
];

export const bloodGroupOptions = [
  { label: "Select blood group", value: "" },
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
];

// left column field config
export const basicFields = [
  {
    type: "file",
    name: "profilePicture",
    label: "Profile Picture",
    showIn: ["onboarding"], // only onboarding
  },
  {
    type: "radio",
    name: "smoking",
    label: "Do you smoke?",
    options: smokingOptions,
    showIn: ["onboarding", "edit"],
  },
  {
    type: "radio",
    name: "drinking",
    label: "Do you drink?",
    options: drinkingOptions,
    showIn: ["onboarding", "edit"],
  },
  {
    type: "input",
    name: "emergencyNumber",
    label: "Emergency contact Number",
    inputType: "tel",
    placeholder: "Enter an emergency phone number",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "date",
    name: "dateOfBirth",
    label: "Date Of Birth",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "radio",
    name: "gender",
    label: "Gender",
    options: genderOptions,
    showIn: ["onboarding", "edit"],
  },
  {
    type: "textarea",
    name: "address",
    label: "Address",
    rows: 4,
    placeholder: "Enter your residential address",
    showIn: ["onboarding", "edit"],
  },
];

// right column field config
export const medicalFields = [
  {
    type: "select",
    name: "bloodType",
    label: "Blood Type",
    options: bloodGroupOptions,
    placeholder: "Select blood type",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "input",
    name: "cholesterol",
    label: "Cholesterol",
    inputType: "text",
    placeholder: "e.g., 120/80 mmHg",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "input",
    name: "height",
    label: "Height",
    inputType: "text",
    placeholder: "e.g., 180 cm",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "input",
    name: "weight",
    label: "Weight",
    inputType: "text",
    placeholder: "e.g., 65 Kg",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "input",
    name: "bloodPressure",
    label: "Blood Pressure",
    inputType: "text",
    placeholder: "e.g., 120/80 mmHg",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "input",
    name: "glucoseLevel",
    label: "Glucose level",
    inputType: "text",
    placeholder: "e.g., 120 mg/dL",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "textarea",
    name: "allergies",
    label: "Allergies",
    rows: 3,
    placeholder: "e.g., Penicillin, Peanuts",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "textarea",
    name: "medicalCondition",
    label: "Medical Condition",
    rows: 3,
    placeholder: "e.g., Asthma, Hypertension",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "textarea",
    name: "Food_or_Drug_Intolerances",
    label: "Food or Drug Intolerances",
    rows: 4,
    placeholder:
      "List any food (e.g., lactose, gluten) or drug intolerances and reactions.",
    showIn: ["onboarding", "edit"],
  },
  {
    type: "textarea",
    name: "Mental_Health_History",
    label: "Mental Health History",
    rows: 4,
    placeholder:
      "Describe any mental health diagnoses, therapy, or medications.",
    showIn: ["onboarding", "edit"],
  },
];
