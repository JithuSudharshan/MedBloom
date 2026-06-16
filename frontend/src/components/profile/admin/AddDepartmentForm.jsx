import { departmentForm } from "../../../config/addNewDepartmentForm";
import { useWatch } from "react-hook-form";
import Input from "../../form/Input";
import RadioGroup from "../../form/RadioGroup";
import TextArea from "../../form/TextArea";
import Button from "../../landing page/Button";

export default function AddDepartmentForm({
    cardTitle,
    setDepartmentData,
    mode,
    setValue,
    setIsModalOpen,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    submitError,
    department_id,
    watch
}) {


    const renderField = (field) => {
        if (!field.showIn.includes(mode)) return null;

        switch (field.type) {
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
                        setValue={setValue}
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
                        setValue={setValue}
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
                        setValue={setValue}
                        maxWords={field.maxWords}
                        watch={watch}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data, setDepartmentData, setIsModalOpen, mode, department_id))} className="max-w-4xl mx-auto p-6 bg-white rounded shadow">

            <h2 className="text-2xl font-semibold text-teal-700 mb-6">
                {cardTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                {departmentForm.map(renderField)}
            </div>

            {submitError && (
                <p className="mt-4 text-sm text-red-600">{submitError}</p>
            )}

            <div className="flex justify-end mt-10 gap-3">
                {mode === "edit" && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
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
