
const MedicalItem = ({ label, value, highlight }) => (
    <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className={`font-semibold ${highlight ? "text-blue-500 underline" : "text-gray-800"}`}>
            {value}
        </p>
    </div>
);


const MedicalGrid = ({ patient }) => (
    <section>
        <div className="grid grid-cols-2 gap-x-15 gap-y-12">

            <MedicalItem label="Blood Type" value={patient?.bloodType} />
            <MedicalItem label="Cholestrol" value={patient?.cholesterol} />

            <MedicalItem label="Height" value={patient?.height} />
            <MedicalItem label="Weight" value={patient?.weight} />

        </div>
        <div className="flex mt-10 flex-col gap-x-12 gap-y-12">
            <MedicalItem label="Blood Pressure" value={patient?.bloodPressure} />
            <MedicalItem label="Glucose level" value={patient?.glucoseLevel} />

            <MedicalItem label="Allergies" value={patient?.allergies} />
            <MedicalItem label="Medical Condition" value={patient?.medicalCondition} />
        </div>
    </section>

);

export default MedicalGrid;
