import { useState, useEffect } from 'react';

export default function FileUpload({ label, name, register, error, setValue, role = "patient" }) {
    const isDoctor = role?.toLowerCase() === 'doctor';
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            //Set file in form
            setValue(name, file);
            setFileName(file.name);

            //Create preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            //fallback function
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
            setFileName('');
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleRemove = () => {
        setPreview(null);
        setFileName('');
        setValue(name, null);
        // Reset the input field if it exists
        const fileInput = document.getElementById(name);
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className="mb-6">
            <label className={`text-sm mb-2 font-medium block transition-colors ${isDoctor ? "text-[#6B3B3D]" : "text-teal-700"}`}>{label}</label>

            {/* Show preview if image is uploaded */}
            {preview ? (
                <div className="relative">
                    <div className={`w-full rounded-lg border-2 p-4 transition-colors ${isDoctor ? "border-[#B08B8C] bg-[#FCF8F8]" : "border-teal-400 bg-teal-50"}`}>
                        <div className="flex items-center gap-4">
                            {/* Image Preview */}
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                            />

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">
                                    {fileName}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Image uploaded successfully</p>
                            </div>

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Upload Area */
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id={name}
                    />
                    <label
                        htmlFor={name}
                        className={`w-full px-4 py-8 text-gray-400 rounded-lg border-2 border-dashed border-gray-300 
                            cursor-pointer flex flex-col items-center justify-center text-sm bg-white transition-colors ${isDoctor ? "hover:border-[#B08B8C]" : "hover:border-teal-400"}`}
                    >
                        <svg
                            className="w-8 h-8 mb-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <span>Upload a picture as your profile picture</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WEBP up to 5MB</span>
                    </label>
                </div>
            )}

            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}
