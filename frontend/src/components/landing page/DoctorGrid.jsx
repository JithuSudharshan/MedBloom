import DoctorCard from "./DoctorCard";

export default function DoctorsGrid({ doctors }) {
    console.log("doctors2", doctors)
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
                <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                />
            ))}
        </div>
    );
}
