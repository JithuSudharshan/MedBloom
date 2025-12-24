const UpcomingAppointments = ({ appointments = [] }) => {
    const data =
        appointments.length > 0
            ? appointments
            : [{ id: 1, patient: "Sarah Thomas", time: "March 3rd 2025, At 10:30 AM" }];

    return (
        <section className="border border-slate-200 rounded-xl mb-4">
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                <p className="text-xs text-[#008989] uppercase tracking-wide">
                    Upcoming Appointments
                </p>
            </div>
            <div className="px-6 py-3 text-xs">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between text-slate-700"
                    >
                        <div>
                            <p className="font-semibold">{item.patient}</p>
                            <p className="text-slate-500 mt-0.5">{item.time}</p>
                        </div>
                        <button className="text-xs text-slate-500 border border-slate-300 rounded-full px-3 py-1 hover:bg-slate-50">
                            View
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UpcomingAppointments;
