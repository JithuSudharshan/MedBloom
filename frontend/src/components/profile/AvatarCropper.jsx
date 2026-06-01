import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { updatePatientAvatar } from "../../api/patientApi";
import { updateDoctorAvatar } from "../../api/doctorApi";
import { updateDoctorAvatarForAdmin, updatePatientAavatarForAdmin } from "../../api/adminApi";
import Button from "../landing page/Button";
import { showToast } from "../ui/Toast";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const AvatarCropper = ({ onCancel, onSave, user, _id, role }) => {
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const onSelectFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const extension = file.name.split(".").pop().toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            showToast.error("Invalid file extension. Allowed: jpg, jpeg, png, webp");
            e.target.value = "";
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            showToast.error("Only JPG, PNG and WEBP images are allowed");
            e.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showToast.error("Image must be less than 2MB");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => setUpImg(reader.result.toString()));
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;

        const initialCrop = centerCrop(
            makeAspectCrop(
                { unit: "%", width: 70 },
                1,
                width,
                height
            ),
            width,
            height
        );

        setCrop(initialCrop);
    };

    const generateCanvas = useCallback((image, crop) => {
        if (!crop || !previewCanvasRef.current || !image) return;

        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext("2d");

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.beginPath();
        ctx.rect(0, 0, crop.width, crop.height);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, []);

    const handleSave = async () => {
        if (!completedCrop || !previewCanvasRef.current) return;

        setIsSaving(true);

        const canvas = previewCanvasRef.current;

        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.9)
        );

        const formData = new FormData();
        formData.append("image", blob, "avatar.jpg");

        let res;

        try {
            if (user === "patient") {
                res = await updatePatientAvatar(formData);
            } else if (user === "doctor") {
                res = await updateDoctorAvatar(formData);
            } else if (user === "admin" && role === "doctor") {
                res = await updateDoctorAvatarForAdmin(formData, _id);
            } else if (user === "admin" && role === "patient") {
                res = await updatePatientAavatarForAdmin(formData, _id);
            }

            if (!res?.data?.success) {
                showToast.error("Something went wrong, please try again");
                return;
            }

            showToast.success("Avatar updated successfully!");

            onSave(res?.data?.profile_url);

        } catch (error) {
            console.error(error);
            showToast.error("Avatar upload failed");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">

            <h2 className="text-lg font-semibold text-gray-800">
                Update profile picture
            </h2>

            <Button>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={onSelectFile}
                />
            </Button>

            {upImg && (
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Crop area */}
                    <div className="max-w-sm">
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => {
                                setCompletedCrop(c);
                                if (imgRef.current) {
                                    generateCanvas(imgRef.current, c);
                                }
                            }}
                            aspect={1}
                            keepSelection
                        >
                            <img
                                ref={imgRef}
                                alt="Crop source"
                                src={upImg}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-500">Preview</span>

                        <div className="w-40 h-40 rounded-xl overflow-hidden border border-gray-200">
                            <canvas
                                ref={previewCanvasRef}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                </div>
            )}

            <div className="flex justify-end gap-3 pt-4">

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={!completedCrop || isSaving}
                    onClick={handleSave}
                    className="px-4 py-2 text-sm rounded-lg bg-teal-600 text-white disabled:bg-gray-300 hover:bg-teal-700"
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>

            </div>

        </div>
    );
};

export default AvatarCropper;