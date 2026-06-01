import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorCard({ doctor }) {
    const navigate = useNavigate();
    const [consultationMode, setConsultationMode] = useState(doctor.consultationMode)

    useEffect(() => {
        if (consultationMode === "both") {
            setConsultationMode("Online & In-Clinic")
        }
    }, [consultationMode])

    console.log("doctor", doctor)

    return (
        <div
            className="
                group flex flex-col p-4 rounded-2xl bg-[#f4f6f5] hover:bg-[#e0f2f1]
                transition-colors duration-400 ease-in-out
                grayscale hover:grayscale-0 cursor-pointer h-full
            "
        >
            {/* Image */}
            <div className="w-full overflow-hidden rounded-xl mb-4">
                <img
                    src={doctor.profilePicture}
                    alt={doctor.displayName}
                    className="
                        w-full h-56 object-cover object-top
                        transition-transform duration-500 group-hover:scale-105
                    "
                />
            </div>

            {/* Info Container */}
            <div className="flex flex-col text-left px-2">
                {/* Name */}
                <h3 className="text-[17px] font-bold text-teal-700">
                    {doctor.displayName}
                </h3>

                {/* Experience */}
                <p className="text-[13px] text-gray-500">
                    Experience : <span className="font-medium text-gray-600">{doctor.yearOfExperience} years</span>
                </p>

                {/* Specialization */}
                <p className="text-[13px] text-gray-500 mt-0.5">
                    Specialization : <span className="font-medium text-gray-600">{doctor.primarySpecialization}</span>
                </p>

                {/* mode of consultation */}
                <p className="text-[13px] text-gray-500 mt-0.5">
                    consultation : <span className="font-medium text-gray-600">{consultationMode}</span>
                </p>

                {/* Button Container */}
                <div className="mt-2 h-[32px] relative w-full">
                    <button
                        onClick={() => navigate(`/doctor/${doctor._id || doctor.user || 123}`)}
                        className="
                            absolute top-0 left-0 w-[85%]
                            flex items-center justify-between
                            bg-gradient-to-r from-teal-500 to-cyan-400
                            rounded-full h-full pl-5 pr-1.5 shadow-sm
                            opacity-0 translate-y-3
                            group-hover:opacity-100 group-hover:translate-y-0
                            transition-all duration-400 ease-out
                            active:scale-95
                        "
                    >
                        <span className="text-white text-[13px] font-medium tracking-wide">View Profile</span>
                        <div className="h-5 w-5 bg-white text-cyan-500 rounded-full flex items-center justify-center shrink-0">
                            <ArrowRight size={16} strokeWidth={2.5} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
