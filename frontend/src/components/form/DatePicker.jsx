
import "react-datepicker/dist/react-datepicker.css";

export default function DateInput({
    label,
    name,
    register,
    setValue,
    error,
    role = "patient"
}) {
    const isDoctor = role?.toLowerCase() === 'doctor';
    return (
        <div className="flex flex-col gap-1 mb-5">
            <label className={`text-sm mb-2 font-medium block transition-colors ${isDoctor ? "text-[#6B3B3D]" : "text-teal-700"}`}>
                {label}
            </label>

            <input
                type="date"

                {...register(`${name}._raw`)}
                onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;

                    const [year, month, day] = value.split("-");


                    setValue(name, { year, month, day }, { shouldValidate: true });
                }}
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-shadow ${isDoctor ? "focus:ring-[#B08B8C]" : "focus:ring-teal-500"}`}
            />

            {error && (
                <p className="text-xs text-red-600 mt-1">
                    {error.message}
                </p>
            )}
        </div>
    );
}
