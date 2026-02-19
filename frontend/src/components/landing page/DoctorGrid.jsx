import DoctorCard from "./DoctorCard";

export default function DoctorsGrid({ doctors }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
                <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    active={index === 0}
                />
            ))}
        </div>
    );
}
