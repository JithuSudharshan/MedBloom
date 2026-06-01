export default function TodayAppointments({ appointments }) {

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">

            <h3 className="text-[#6B3B3D] font-semibold text-lg mb-4">
                Today’s Appointments
            </h3>

            <div className="space-y-3">

                {appointments?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">

                        <p className="text-gray-600 text-sm">
                            {item.name} - {item.time}
                        </p>

                        <span className={`px-3 py-1 text-xs rounded-full font-medium
                            ${item.type === "Online"
                                ? "bg-[#F8E9EA] text-[#B08B8C]"
                                : "bg-blue-50 text-blue-600"}
                        `}>
                            {item.type}
                        </span>

                    </div>
                ))}

            </div>
        </div>
    );
}