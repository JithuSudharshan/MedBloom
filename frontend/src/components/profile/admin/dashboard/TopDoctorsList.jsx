export default function TopDoctorsList({ doctors }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 h-[360px]">
            <ul className="space-y-6">
                {doctors?.map((doctor) => (
                    <li key={doctor.id} className="flex items-center gap-4">
                        <img
                            src={doctor.avatar}
                            className="w-10 h-10 rounded-full object-cover"
                            alt=""
                        />
                        <p className="text-gray-400 text-base font-medium">
                            {doctor.name}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
