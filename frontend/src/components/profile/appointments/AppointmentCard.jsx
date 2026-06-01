import CalendarIcon from "../../../assets/icons/Profile_Icons/calendar.svg?react";

export default function AppointmentCard({
    primaryTitle,
    secondaryText,
    dateTimeLabel,
    status,
    showFeedback,
    onFeedback,
    onViewPrescription,
    onReschedule,
    onCancel,
    onViewDetails,
    userRole = "patient",
}) {
    const isDoctor = userRole === 'doctor';
    const statusStyles = {
        Completed: "bg-[#ecfdf5] text-[#047857] border-l-[3px] border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.15)]",
        Upcoming: "bg-[#f0f9ff] text-[#0369a1] border-l-[3px] border-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,0.15)]",
        Cancelled: "bg-[#fef2f2] text-[#be123c] border-l-[3px] border-[#f43f5e] shadow-[0_0_10px_rgba(244,63,94,0.15)]",
    };

    const isCancelled = status === "Cancelled";

    return (
        <div className={`flex items-stretch justify-between rounded-3xl border border-transparent bg-white px-8 py-6 shadow-sm hover:scale-[1.01] transition-all duration-300 ${
            isDoctor ? "hover:border-[#B08B8C] hover:shadow-[0_0_20px_rgba(176,139,140,0.2)]" : "hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        } ${isCancelled ? 'opacity-60 grayscale-[0.5]' : ''}`}>
            {/* LEFT: doctor + time */}
            <div className="flex flex-col gap-3">
                <div>
                    <h3 className={`text-[22px] font-bold leading-tight ${isDoctor ? "text-[#6B3B3D]" : "text-[#006D6F]"}`}>
                        {primaryTitle}
                    </h3>
                    <p className="text-[14px] text-slate-400 mt-1 font-medium">{secondaryText}</p>
                </div>

                <div className="flex items-center gap-2 text-[13px] text-slate-400">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span>{dateTimeLabel}</span>
                </div>
            </div>

            {/* RIGHT: status + action */}
            <div className="flex flex-col items-end justify-between gap-3">
                <div
                    className={`inline-flex rounded-full px-4 py-1 text-[12px] font-medium ${statusStyles[status]}`}
                >
                    {status}
                </div>

                {/* actions (top stack for completed, bottom inline for upcoming) */}
                {status === "Completed" ? (
                    <div className="flex flex-col items-end gap-2">
                        {showFeedback && (
                            <button
                                onClick={onFeedback}
                                className={`rounded-full px-5 py-1.5 text-[12px] font-medium text-white transition ${
                                    isDoctor ? "bg-[#B08B8C] hover:bg-[#9D7778]" : "bg-[#008C89] hover:bg-[#006e6b]"
                                }`}
                            >
                                feedback
                            </button>
                        )}
                        <button
                            onClick={onViewPrescription}
                            className={`rounded-full px-5 py-1.5 text-[12px] font-medium text-white shadow-sm transition ${
                                isDoctor ? "bg-gradient-to-r from-[#B08B8C] to-[#C39496] hover:from-[#9D7778] hover:to-[#B08B8C]" : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                            }`}
                        >
                            View Prescription
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        {!isDoctor && !isCancelled && (
                            <>
                                <button
                                    onClick={onReschedule}
                                    className={`rounded-full border px-5 py-1.5 text-[12px] font-medium transition ${
                                        isDoctor ? "border-[#B08B8C] bg-rose-50 text-[#B08B8C] hover:bg-rose-100" : "border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100"
                                    }`}
                                >
                                    Reschedule
                                </button>
                                <button
                                    onClick={onCancel}
                                    className="rounded-full border border-red-200 bg-red-50 px-5 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-100 transition"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        <button
                            onClick={onViewDetails}
                            className={`rounded-full px-6 py-1.5 text-[12px] font-medium text-white shadow-md hover:shadow-lg transition-all ${
                                isDoctor ? "bg-gradient-to-r from-[#B08B8C] to-[#C39496] hover:from-[#9D7778] hover:to-[#B08B8C]" : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                            }`}
                        >
                            View Details
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
