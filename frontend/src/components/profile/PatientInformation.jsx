import React, { useState } from 'react';
import { Edit3, KeyRound, User, Activity } from "lucide-react";
import ProfileRow from "./ProfileRow";
import MedicalGrid from "./MedicalGrid";
import Modal from "../../components/profile/Modal";
import PasswordInput from "../form/PasswordInput"
import Button from '../landing page/Button';
import UseChangePassword from '../../hooks/useChangePasssword'
import { useNavigate } from 'react-router-dom';

const PatientInformation = ({ patient, isAdmin = false }) => {
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
        isAdmin ?
            navigate(`/admin/patient/${patient._id}/edit`)
            :
            navigate('/patient/edit-profile')
    }

    const {
        register,
        handleSubmit,
        onSubmit,
        formState: { errors },
    } = UseChangePassword()

    return (
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 shrink-0 flex flex-col w-full h-fit">
            
            {/* Header and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Medical Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your personal and clinical details</p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                    {patient.authMethod !== "google" && !isAdmin && (
                        <button onClick={handleClick} className="flex items-center gap-2 bg-white border border-teal-200 text-teal-700 px-5 py-2.5 text-sm font-semibold rounded-full hover:bg-teal-50 transition-colors shadow-sm">
                            <KeyRound className="w-4 h-4" /> <span className="hidden sm:inline">Change Password</span>
                        </button>
                    )}
                    <button onClick={handleEditProfile} className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-teal-700 transition-all shadow-md hover:shadow-lg">
                        <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                </div>
            </div>

            <div className="flex-1 space-y-8">
                {/* Identity & Contact Card */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-[#008C89] mb-6 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Identity & Contact
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ProfileRow label="Full Name" value={patient?.fullName} />
                        <ProfileRow label="Email Address" value={patient?.email} />
                        <ProfileRow label="Date Of Birth" value={patient?.dob ? new Date(patient.dob).toLocaleDateString() : "-"} />
                        
                        <ProfileRow label="Personal Number" value={patient?.phone} />
                        <ProfileRow label="Emergency Contact" value={patient?.emergencyNumber} />
                        <ProfileRow label="Gender" value={patient?.gender} />
                        
                        <div className="sm:col-span-2 lg:col-span-3">
                            <ProfileRow label="Address" value={patient?.address} />
                        </div>
                    </div>
                </div>

                {/* Medical Information Section */}
                <div className="bg-teal-50/30 border border-teal-50 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-[#008C89] mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Clinical Vitals & Health History
                    </h2>
                    <MedicalGrid userDetails={patient} user={"patient"} />
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={openModal} onClose={handleClose}>
                <h3 className="text-xl font-semibold text-teal-700 mb-4">Change Password</h3>
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
                            className="bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700"
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </Modal>

        </div>
    )
};

export default PatientInformation;
