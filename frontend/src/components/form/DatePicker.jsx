
import "react-datepicker/dist/react-datepicker.css";

export default function DateInput({
    label,
    name,
    register,
    setValue,
    error,
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type="date"
                // ⚠️ DO NOT bind value to form state
                {...register(`${name}._raw`)}
                onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;

                    const [year, month, day] = value.split("-");

                    // ✅ store structured object
                    setValue(name, { year, month, day }, { shouldValidate: true });
                }}
                className="
          w-full rounded-lg border border-gray-300
          px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-teal-500
        "
            />

            {error && (
                <p className="text-xs text-red-600 mt-1">
                    {error.message}
                </p>
            )}
        </div>
    );
}
