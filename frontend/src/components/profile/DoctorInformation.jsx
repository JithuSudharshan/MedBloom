import React, { useState } from 'react';
import { Edit3, KeyRound, User, Stethoscope, Activity, FileText } from "lucide-react";
import ProfileRow from "./ProfileRow";
import Modal from "../../components/profile/Modal";
import PasswordInput from "../form/PasswordInput"
import Button from '../landing page/Button';
import UseChangePassword from '../../hooks/useChangePasssword'
import { useNavigate } from 'react-router-dom';

const DoctorInformation = ({ doctor, showActions = true, isAdmin = false }) => {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleClick = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    const handleEditProfile = () => {
        if (isAdmin) return navigate(`/admin/doctors/${doctor._id}/edit`)
        return navigate('/doctor/edit-profile')
    }

    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = UseChangePassword()

    const formatConsultationMode = (mode) => {
        if (mode === "both") return "Online & Offline";
        if (mode === "online") return "Online";
        if (mode === "offline") return "Offline";
        return "-";
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 shrink-0 flex flex-col w-full h-fit">
            
            {/* Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Professional Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your clinical details and practice information</p>
                </div>
                
                {showActions && (
                    <div className="flex items-center gap-3 shrink-0">
                        {doctor?.authMethod !== "google" && !isAdmin && (
                            <button onClick={handleClick} className="flex items-center gap-2 bg-white border border-rose-200 text-rose-700 px-5 py-2.5 text-sm font-semibold rounded-full hover:bg-rose-50 transition-colors shadow-sm">
                                <KeyRound className="w-4 h-4" /> <span className="hidden sm:inline">Change Password</span>
                            </button>
                        )}
                        <button onClick={handleEditProfile} className="flex items-center gap-2 bg-[#B08B8C] text-white px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-[#9D7778] transition-all shadow-md hover:shadow-lg">
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 space-y-8">
                {/* Identity & Contact Card */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-[#6B3B3D] mb-6 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Identity & Contact
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ProfileRow label="Full Name" value={doctor?.fullName || "-"} />
                        <ProfileRow label="Email Address" value={doctor?.email || "-"} />
                        <ProfileRow label="Date Of Birth" value={doctor?.dob || "-"} />
                        
                        <ProfileRow label="Phone Number" value={doctor?.phone || "-"} />
                        <ProfileRow label="Gender" value={doctor?.gender || "-"} />
                        <div className="sm:col-span-1 lg:col-span-1">
                             <ProfileRow label="Status" value={doctor?.profileStatus || "-"} />
                        </div>
                        
                        <div className="sm:col-span-2 lg:col-span-3">
                            <ProfileRow label="Clinic Address" value={doctor?.address || "-"} />
                        </div>
                    </div>
                </div>

                {/* Professional Practice */}
                <div className="bg-rose-50/30 border border-rose-100/60 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-[#6B3B3D] mb-6 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5" />
                        Professional Practice
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ProfileRow label="Display Name" value={doctor?.displayName || doctor?.fullName || "-"} />
                        <ProfileRow label="Primary Specialization" value={doctor?.primarySpecialization || "-"} />
                        <ProfileRow label="Years of Experience" value={doctor?.yearsOfExperience ? `${doctor.yearsOfExperience} Years` : "-"} />
                    </div>
                </div>

                {/* Consultation Details */}
                <div className="bg-rose-50/30 border border-rose-100/60 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-[#6B3B3D] mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Consultation Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ProfileRow label="Consultation Mode" value={formatConsultationMode(doctor?.consultationMode)} />
                        
                        {(doctor?.consultationMode === "both" || doctor?.consultationMode === "online") && (
                            <ProfileRow label="Online Fee" value={doctor?.consultationFeesOnline ? `₹ ${doctor.consultationFeesOnline}` : "-"} />
                        )}
                        
                        {(doctor?.consultationMode === "both" || doctor?.consultationMode === "offline") && (
                            <ProfileRow label="In-Clinic Fee" value={doctor?.consultationFeesOffline ? `₹ ${doctor.consultationFeesOffline}` : "-"} />
                        )}
                    </div>
                </div>

                {/* Biography */}
                {showActions && (
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8">
                        <h2 className="text-xl font-bold text-[#6B3B3D] mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Biography
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                            {doctor?.shortBio || "No biography added yet."}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showActions && (
                <Modal isOpen={openModal} onClose={handleClose}>
                    <h3 className="text-xl font-semibold text-[#6B3B3D] mb-4">Change Password</h3>
                    <form onSubmit={handleSubmit((data) => onSubmit(data, setLoading))}>
                        <PasswordInput
                            label="Current Password"
                            name="currentPassword"
                            register={register}
                            placeholder="Enter current password"
                            type="password"
                            error={errors.currentPassword}
                        />
                        <PasswordInput
                            label="New Password"
                            name="newPassword"
                            register={register}
                            placeholder="Enter new password"
                            type="password"
                            error={errors.newPassword}
                        />
                        <PasswordInput
                            label="Confirm New Password"
                            name="confirmPassword"
                            register={register}
                            placeholder="Confirm new password"
                            type="password"
                            error={errors.confirmPassword}
                        />
                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={handleClose}
                                className="bg-gray-300 text-gray-700 px-2 py-2 rounded-xl mr-2"
                                variant='outline'
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#B08B8C] text-white px-4 py-2 rounded-xl hover:bg-[#6B3B3D]"
                            >
                                {loading ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
};

export default DoctorInformation;
