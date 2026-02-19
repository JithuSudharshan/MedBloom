
const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
]

export const departmentForm = [
    {
        type: "input",
        name: "departmentName",
        label: "Department Name",
        inputType: "text",
        placeholder: "Eg : Cardiology",
        showIn: ["addDepartment", "edit"]
    },
    {
        type: "radio",
        name: "status",
        label: "Initial Status of the Department",
        options: statusOptions,
        showIn: ["addDepartment", "edit"]
    },
    {
        type: "textarea",
        name: "departmentDescription",
        label: "Department Description",
        inputType: "text",
        placeholder: "...write the description explaning the service it provides...",
        showIn: ["addDepartment", "edit"]
    },
];