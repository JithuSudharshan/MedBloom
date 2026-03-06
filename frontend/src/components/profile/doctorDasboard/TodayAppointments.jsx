export default function TodayAppointments() {

    const appointments = [
        { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
        { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
        { name: "Rajesh kumar", time: "10:30 AM", type: "Online" },
        { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
        { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
        { name: "Rajesh kumar", time: "10:30 AM", type: "Clinic" },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">

            <h3 className="text-teal-700 font-semibold text-lg mb-4">
                Today’s Appointments
            </h3>

            <div className="space-y-3">

                {appointments.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">

                        <p className="text-gray-600 text-sm">
                            {item.name} - {item.time}
                        </p>

                        <span className={`px-3 py-1 text-xs rounded-full
                            ${item.type === "Online"
                                ? "bg-teal-100 text-teal-600"
                                : "bg-blue-100 text-blue-600"}
                        `}>
                            {item.type}
                        </span>

                    </div>
                ))}

            </div>
        </div>
    );
}