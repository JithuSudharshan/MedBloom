import Input from "../form/Input";
import Button from "../landing page/Button";
import RadioGroup from "../form/RadioGroup";
import TextArea from "../form/TextArea";
import Select from "../form/Select";
import FileUpload from "../form/FileUpload";
import { basicFields, medicalFields } from "../../config/patientFormConfig";
import DateInput from "../form/DatePicker";
import { date } from "yup";


export default function PatientForm({
    mode = "onboarding",
    register,
    handleSubmit,
    onSubmit,
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
                )
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
                )
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
                )
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
                )
            case "date":
                return (
                    <DateInput
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        setValue={setValue}
                        register={register}
                        error={errors[field.name]}
                    />
                )
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                        Basic Details
                    </h2>
                    {basicFields.map(renderField)}
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                        Medical Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {/* first two medical fields in a grid */}
                        {medicalFields.slice(0, 2).map(renderField)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {medicalFields.slice(2, 4).map(renderField)}
                    </div>

                    {/* rest full width */}
                    {medicalFields.slice(4).map(renderField)}
                </div>
            </div>

            {submitError && (
                <p className="mt-4 text-sm text-red-600">{submitError}</p>
            )}

            <div className="flex justify-end mt-10 gap-3">
                {mode === "edit" && (
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                )}
                <Button
                    loading={isSubmitting}
                    className="px-10 py-3 hover:bg-teal-600"
                    type="submit"
                >
                    {isSubmitting
                        ? "Saving..."
                        : mode === "edit"
                            ? "Save changes"
                            : "Save and Continue"}
                </Button>
            </div>
        </form>
    );
}
