import React from 'react';
import CalendarIcon from "../../../assets/icons/Profile_Icons/calendar.svg?react";
import { Clock } from 'lucide-react';

export default function DoctorAppointmentRow({
    appointmentId,
    primaryTitle,
    secondaryText,
    dateTimeLabel,
    status,
    onViewPrescription,
    onViewDetails,
    hasPrescription,
}) {
    const statusStyles = {
        Completed: "bg-[#ecfdf5] text-[#047857] border-[#10b981]",
        Upcoming: "bg-[#f0f9ff] text-[#0369a1] border-[#0ea5e9]",
        Cancelled: "bg-[#fef2f2] text-[#be123c] border-[#f43f5e]",
        "In Progress": "bg-[#fffbeb] text-[#d97706] border-[#f59e0b]",
    };

    const isCancelled = status === "Cancelled";

    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm hover:border-[#B08B8C] hover:shadow-md transition-all duration-300 gap-4 ${isCancelled ? 'opacity-60 grayscale-[0.5]' : ''}`}>
            
            {/* ID & Patient Info */}
            <div className="flex items-center gap-4 min-w-[250px]">
                <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ID: {appointmentId || "N/A"}</span>
                    <h3 className="text-[16px] font-bold text-[#6B3B3D] leading-tight truncate max-w-[200px]">
                        {primaryTitle}
                    </h3>
                    <p className="text-[13px] text-slate-500 font-medium truncate max-w-[200px]">{secondaryText}</p>
                </div>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col sm:items-end min-w-[150px]">
                <div className="flex items-center gap-1.5 text-[13px] text-slate-600 font-medium">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span>{dateTimeLabel}</span>
                </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-end gap-4 min-w-[250px]">
                <span className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-[11px] font-bold border ${statusStyles[status] || statusStyles['Upcoming']}`}>
                    {status}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onViewDetails}
                        className="rounded-lg px-4 py-1.5 text-[12px] font-medium text-white shadow-sm transition bg-gradient-to-r from-[#B08B8C] to-[#C39496] hover:from-[#9D7778] hover:to-[#B08B8C]"
                    >
                        View
                    </button>
                    {status === "Completed" && hasPrescription && (
                        <button
                            onClick={onViewPrescription}
                            className="rounded-lg border border-[#B08B8C] bg-rose-50 px-3 py-1.5 text-[12px] font-medium text-[#B08B8C] hover:bg-rose-100 transition"
                        >
                            Prescription
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
