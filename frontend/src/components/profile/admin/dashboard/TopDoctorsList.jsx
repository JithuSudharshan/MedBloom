export default function TopDoctorsList({ doctors }) {
    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,109,111,0.06)] p-6 h-full min-h-[360px] border border-white flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-gray-800 font-bold text-lg">Top Rated Doctors</h3>
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                    ⭐
                </div>
            </div>
            
            {(!doctors || doctors.length === 0) ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    No top rated doctors yet.
                </div>
            ) : (
                <ul className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {doctors?.map((doctor) => (
                        <li key={doctor.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                            <div className="relative">
                                <img
                                    src={doctor.avatar}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-rose-100 transition-colors"
                                    alt={doctor.name}
                                />
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-800 text-sm font-semibold group-hover:text-teal-700 transition-colors">
                                    {doctor.name}
                                </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                    {doctor.speciality || "General Physician"}
                                </p>
                            </div>
                            <div className="text-xs font-medium text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                                {doctor.rating || "5.0"} ★
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
