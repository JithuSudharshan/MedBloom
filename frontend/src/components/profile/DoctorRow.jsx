export const DoctorRow = ({ doctor, viewDetails, onOpenBlock, onOpenUnblock }) => {
    const isBlocked = doctor.status === "blocked";
    console.log("isBlocked:", isBlocked);



    return (
        <div className="flex items-stretch justify-between rounded-2xl bg-white shadow-sm border  border-slate-100 px-6 py-4 mb-4">
            {/* Left: avatar + basic info */}
            <div className="flex items-center  gap-6">
                <img
                    src={doctor.profilePicture}
                    alt={doctor.displayName}
                    className="h-14 w-14 rounded-full object-cover"
                />
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{doctor.displayName}</p>
                        <span className="text-xs text-slate-400">• {doctor.primarySpecialization}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                        Contact Number{" "}
                        <span className="text-slate-700 font-medium">
                            {doctor.contactNumber}
                        </span>
                    </p>
                    <div className="flex gap-8 text-xs text-slate-400">
                        <p>
                            Experience{" "}
                            <span className="text-slate-800 font-semibold">
                                {doctor.yearOfExperience} Years
                            </span>
                        </p>
                        <p>
                            Total Appointments{" "}
                            <span className="text-slate-800 font-semibold">
                                {doctor.totalAppointments || "-"}
                            </span>
                        </p>
                        <p>
                            Today&apos;s Appointments{" "}
                            <span className="text-slate-800 font-semibold">
                                {doctor.todaysAppointments || "-"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: availability + actions */}
            <div className="flex flex-col items-end justify-between gap-2 text-right">
                <div className="flex items-center gap-5">
                    <span
                        className={`text-sm font-semibold ${isBlocked ? "text-rose-500" : "text-emerald-500"
                            }`}
                    >
                        {isBlocked ? "Blocked" : "Available"}
                    </span>
                    <div className="flex items-center gap-1 text-emerald-500 text-sm">
                        <span className="text-lg">★</span>
                        <span className="font-semibold text-slate-800">
                            {doctor?.rating?.toFixed(1)}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-slate-400 mb-2">
                    Next Available,{" "}
                    <span className="text-slate-700 font-medium">
                        {doctor.nextAvailableLabel}
                    </span>
                </p>
                <div className="flex items-center gap-6 text-xs font-medium">
                    <button onClick={() => viewDetails(doctor)} className="text-teal-600 hover:text-teal-700">
                        View Profile
                    </button>
                    {isBlocked ? (
                        <button onClick={() => onOpenUnblock(doctor._id)} className="text-emerald-500 hover:text-emerald-600">
                            Unblock Doctor
                        </button>
                    ) : (
                        <button onClick={() => onOpenBlock(doctor._id)} className="text-rose-500 hover:text-rose-600">
                            Block Doctor
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};