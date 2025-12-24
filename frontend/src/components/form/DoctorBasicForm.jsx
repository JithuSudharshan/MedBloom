import Input from "../form/Input";
import Button from "../landing page/Button";
import RadioGroup from "../form/RadioGroup";
import TextArea from "../form/TextArea";
import DatePicker from "../form/DatePicker";
import FileUpload from "../form/FileUpload";
import { basicFields } from "../../config/doctorOnboardingForm";
import Select from "./Select";




export default function DoctorBasicForm({
    mode = "onboarding",
    register,
    handleSubmit,
    onSubmit,
    consultationMode,
    setValue,
    errors,
    isSubmitting,
    submitError,
}) {
    const renderField = (field) => {
        if (!field.showIn.includes(mode)) return null;

        switch (field.type) {
            case "file":
                return (
                    <FileUpload
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        register={register}
                        error={errors[field.name]}
                        setValue={setValue}
                    />
                );
            case "input":
                return (
                    <Input
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        register={register}
                        error={errors[field.name]}
                        placeholder={field.placeholder}
                        type={field.inputType || "text"}
                    />
                );
            case "radio":
                return (
                    <RadioGroup
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        options={field.options}
                        register={register}
                        error={errors[field.name]}
                    />
                );
            case "textarea":
                return (
                    <TextArea
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        register={register}
                        error={errors[field.name]}
                        placeholder={field.placeholder}
                        rows={field.rows}
                    />
                );
            case "date":
                return (
                    <DatePicker
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        register={register}
                        error={errors[field.name]}
                    />
                );
            case "select":
                return (
                    <Select
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        register={register}
                        error={errors[field.name]}
                        placeholder={field.placeholder}
                        options={field.options}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold text-teal-700 mb-6">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                {basicFields.map(renderField)}
            </div>

            {submitError && (
                <p className="mt-4 text-sm text-red-600">{submitError}</p>
            )}

            {(consultationMode === "online" || consultationMode === "both") && (
                <Input
                    label="Online Consultation Fee (₹)"
                    name="consultationFeesOnline"
                    register={register}
                    error={errors.consultationFeesOnline}
                    placeholder="e.g., 500"
                    type="number"
                />
            )}

            {(consultationMode === "offline" || consultationMode === "both") && (
                <Input
                    label="Offline Consultation Fee (₹)"
                    name="consultationFeesOffline"
                    register={register}
                    error={errors.consultationFeesOffline}
                    placeholder="e.g., 700"
                    type="number"
                />
            )}

            <div className="flex justify-end mt-10 gap-3">
                {mode === "edit" && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    loading={isSubmitting}
                    className="px-10 py-3 hover:bg-teal-600"
                    type="submit"
                >
                    {isSubmitting ? "Saving..." : mode === "edit" ? "Save changes" : "Save and Continue"}
                </Button>

            </div>
        </form>
    );
}
