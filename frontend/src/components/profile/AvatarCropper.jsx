import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { updateProfilePicture } from "../../api/patientApi";
import { showToast } from "../ui/Toast";
import Button from "../landing page/Button";

const AvatarCropper = ({ onCancel, onSave }) => {
    const [upImg, setUpImg] = useState(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => setUpImg(reader.result.toString()));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop(
                { unit: "%", width: 70 },
                1, // 1:1 aspect ratio
                width,
                height
            ),
            width,
            height
        )
        setCrop(initialCrop)
    };

    const generateCanvas = useCallback(
        (image, crop) => {
            if (!crop || !previewCanvasRef.current || !image) return;
            const canvas = previewCanvasRef.current;
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            const pixelRatio = window.devicePixelRatio || 1;

            canvas.width = crop.width * pixelRatio;
            canvas.height = crop.height * pixelRatio;
            const ctx = canvas.getContext("2d");

            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = "high";

            ctx.beginPath();
            ctx.arc(
                crop.width / 2,
                crop.height / 2,
                Math.min(crop.width, crop.height) / 2,
                0,
                2 * Math.PI
            );
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
            )
        },
        []
    );

    const handleSave = async () => {
        if (!completedCrop || !previewCanvasRef.current) return;
        setIsSaving(true);

        const canvas = previewCanvasRef.current;

        // canvas -> Blob
        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.9)
        );

        const formData = new FormData();
        formData.append("image", blob, "avatar.jpg")

        const res = await updateProfilePicture(formData)

        if (!res?.data?.success) {
            return showToast.error("Something went wrong,Please try again")
        }

        showToast.success("Profile picture Updated..!")

        onSave(res?.data?.profile_url);
        setIsSaving(false);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
                Update profile picture
            </h2>

            <Button>
                <input type="file" accept="image/*" onChange={onSelectFile} />
            </Button>


            {upImg && (
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="max-w-sm">
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop
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
                        <div className="w-50 h-50 rounded-full overflow-hidden border border-gray-200">
                            <canvas
                                ref={previewCanvasRef}
                                className="w-50 h-50"
                                style={{ borderRadius: "9999px" }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={!completedCrop || isSaving}
                    onClick={() => {
                        if (imgRef.current && completedCrop) {
                            generateCanvas(imgRef.current, completedCrop);
                            handleSave();
                        }
                    }}
                    className="px-4 py-2 text-sm rounded-lg bg-teal-600 text-white disabled:bg-gray-300 hover:bg-teal-700"
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>

            {/* hidden canvas only used for generating the cropped dataURL */}
            <canvas ref={previewCanvasRef} className="hidden" />
        </div>
    )
}

export default AvatarCropper;