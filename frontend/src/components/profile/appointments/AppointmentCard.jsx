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
    variant = "patient",
}) {
    const statusStyles = {
        Completed: "bg-[#A7FFB0] text-[#008A2E]",
        Upcoming: "bg-[#7BD7FF] text-[#006E9A]",
        Cancelled: "bg-[#FFE1E1] text-[#C73636]",
    };

    return (
        <div className="flex items-stretch justify-between rounded-3xl border border-[#E5E7EB] bg-white px-8 py-6 shadow-[0_18px_45px_rgba(16,24,40,0.06)]">
            {/* LEFT: doctor + time */}
            <div className="flex flex-col gap-3">
                <div>
                    <h3 className="text-[18px] font-semibold leading-tight text-[#006D6F]">
                        {primaryTitle}
                    </h3>
                    <p className="text-[14px] text-[#6B7280] mt-1">{secondaryText}</p>
                </div>

                <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
                    <CalendarIcon className="w-4 h-4 text-[#9CA3AF]" />
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
                                className="rounded-full bg-[#008C89] px-5 py-1.5 text-[12px] font-medium text-white hover:bg-[#006e6b] transition"
                            >
                                feedback
                            </button>
                        )}
                        <button
                            onClick={onViewPrescription}
                            className="rounded-full bg-[#008C89] px-5 py-1.5 text-[12px] font-medium text-white hover:bg-[#006e6b] transition"
                        >
                            View Prescription
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onReschedule}
                            className="rounded-full border border-[#00B2C9] px-4 py-1.5 text-[12px] font-medium text-[#00B2C9] hover:bg-[#E0F9FF] transition"
                        >
                            Reschedule
                        </button>
                        <button
                            onClick={onCancel}
                            className="rounded-full border border-[#FF7C7C] px-4 py-1.5 text-[12px] font-medium text-[#FF7C7C] hover:bg-[#FFF1F1] transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onViewDetails}
                            className="rounded-full bg-[#007D7B] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#005f5d] transition"
                        >
                            View Details
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
