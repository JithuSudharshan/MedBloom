import { ArrowRight } from "lucide-react";

export default function DoctorCard({ doctor, active = false }) {
    return (
        <div
            className={`py-15
        rounded-2xl p-4 transition-all duration-300
        ${active ? "bg-teal-50" : "bg-transparent"}
        hover:bg-teal-50
      `}
        >
            {/* Image */}
            <div className="rounded-xl overflow-hidden bg-gray-200">
                <img
                    src={doctor.profilePicture}
                    alt={doctor.displayName}
                    className={`
            w-full h-52 object-cover
            ${active ? "grayscale-0" : "grayscale"}
            transition-all duration-300
          `}
                />
            </div>

            {/* Name */}
            <h3 className="mt-3 text-sm font-semibold text-teal-700">
                {doctor.displayName}
            </h3>

            {/* Experience */}
            <p className="text-xs text-gray-500 mt-1">
                Experience : {doctor.yearOfExperience} years
            </p>

            {/* Specialization */}
            <p className="text-xs text-gray-500">
                Specialization : {doctor.primarySpecialization}
            </p>

            {/* Button */}
            {(active) && (
                <button
                    className="
            mt-3 inline-flex items-center gap-2
            bg-teal-600 text-white text-xs font-medium
            px-4 py-2 rounded-full
            hover:bg-teal-700 transition
          "
                >
                    View Profile
                    <span className="bg-white/20 p-1 rounded-full">
                        <ArrowRight size={12} />
                    </span>
                </button>
            )}
        </div>
    );
}
