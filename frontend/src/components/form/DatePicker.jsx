
import "react-datepicker/dist/react-datepicker.css";

export default function DateInput({
    label,
    name,
    register,
    setValue,
    error,
}) {
    return (
        <div className="flex flex-col gap-1 mb-5">
            <label className="text-sm text-teal-700 mb-2 font-medium block">
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
