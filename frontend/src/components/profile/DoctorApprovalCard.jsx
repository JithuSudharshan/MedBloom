export const DoctorApprovalCard = ({ doctor, onApprove, onReject, isApproving, isRejecting, viewDetails }) => (

    <div className="flex items-center justify-between rounded-2xl bg-white shadow-sm border border-slate-100 px-6 py-4 mb-4">
        {/* Left: avatar + info */}
        <div className="flex items-center gap-4">
            <img
                src={doctor.profilePicture}
                alt={doctor.displayName}
                className="h-14 w-14 rounded-full object-cover"
            />
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{doctor.displayName}</p>
                    <span className="text-sm text-slate-400">
                        . {doctor.primarySpecialization}
                    </span>
                </div>
                <p className="text-xs text-slate-400">
                    Contact Number{" "}
                    <span className="font-medium text-slate-700">
                        {doctor.contactNumber}
                    </span>
                </p>
                <div className="flex gap-10 text-xs mt-5 text-slate-400">
                    <p>
                        Experience :{" "}
                        <span className="font-semibold text-slate-800">
                            {doctor.yearOfExperience} Years
                        </span>
                    </p>
                    <p>
                        Email :{" "}
                        <span className="font-medium text-slate-800">{doctor.user.email}</span>
                    </p>
                    <button className="mt-1 text-xs ml-20 font-medium text-teal-600 hover:text-teal-700" onClick={() => viewDetails(doctor)}>
                        Review Application
                    </button>
                </div>
            </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-col items-end gap-3">
            <button
                onClick={() => onApprove(doctor.id)}
                className="px-4 py-1.5 text-xs font-semibold rounded-full bg-emerald-400 text-white hover:bg-emerald-500 transition"
            >
                {isApproving ? " Approving...." : " APPROVE"}

            </button>
            <button
                onClick={() => onReject(doctor.id)}
                className="px-5.5 py-1.5 text-xs font-semibold rounded-full bg-red-400 text-white hover:bg-red-500 transition"
            >
                {isRejecting ? " Rejecting...." : " REJECT"}
            </button>

        </div>
    </div>
);