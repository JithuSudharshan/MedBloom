import React, { useState, useEffect } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadMedicalRecord } from '../../../api/patientApi';
import { showToast } from '../../ui/Toast';

const UploadRecordModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden")
        } else {
            document.body.classList.remove("overflow-hidden")
            // Reset state when closed
            setSelectedFile(null);
            setTitle('');
            setCategory('');
            setDescription('');
        }
        return () => document.body.classList.remove("overflow-hidden")
    }, [isOpen]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            showToast.error("Only PDF, JPG, and PNG files are allowed");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast.error("File size must be less than 10MB");
            return;
        }
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile || !title || !category) {
            showToast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("title", title);
            formData.append("category", category);
            if (description) formData.append("description", description);

            const res = await uploadMedicalRecord(formData);
            if (res?.data?.success) {
                showToast.success("Record uploaded successfully");
                onUploadSuccess(res.data.record);
                onClose();
            }
        } catch (error) {
            console.error("Upload failed", error);
            showToast.error("Failed to upload document. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-[#00A4A3] text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Upload New Record
                    </h2>
                    <button 
                        onClick={onClose}
                        disabled={isUploading}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    
                    {/* Form Fields */}
                    <div className="flex-1 flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Record Title <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Blood Test 2024" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A4A3]/20 focus:border-[#00A4A3] transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Classify Record <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#00A4A3]/20 focus:border-[#00A4A3] transition-all text-sm text-gray-800 cursor-pointer"
                                >
                                    <option value="" disabled>Select category...</option>
                                    <option value="lab">Lab Report</option>
                                    <option value="imaging">Imaging (X-ray/MRI)</option>
                                    <option value="prescription">Prescription</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
                            <textarea 
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add any relevant notes..." 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A4A3]/20 focus:border-[#00A4A3] transition-all text-sm resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* File Upload Area */}
                    <div className="flex-1 flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">File Upload <span className="text-red-500">*</span></label>
                        <div 
                            className={`flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all ${
                                dragActive ? 'border-[#00A4A3] bg-teal-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {!selectedFile ? (
                                <>
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <UploadCloud className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-semibold text-[#00A4A3] cursor-pointer hover:underline relative">
                                            Click to browse
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleChange}
                                                accept=".pdf,.jpg,.png,.jpeg"
                                                disabled={isUploading}
                                            />
                                        </span>
                                        {" "}or drag & drop
                                    </p>
                                    <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 10MB)</p>
                                </>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <CheckCircle2 className="w-12 h-12 text-teal-500 mb-3" />
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <button 
                                        onClick={() => setSelectedFile(null)}
                                        disabled={isUploading}
                                        className="text-xs text-red-500 hover:underline mt-4 font-medium disabled:opacity-50"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                    <button 
                        onClick={onClose}
                        disabled={isUploading}
                        className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpload}
                        className="px-5 py-2 text-sm font-medium text-white bg-[#00A4A3] hover:bg-teal-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={!selectedFile || !title || !category || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Upload Document"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadRecordModal;
