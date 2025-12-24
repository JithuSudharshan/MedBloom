import React, { useState } from 'react';
import ProfileRow from "./ProfileRow";
import MedicalGrid from "./MedicalGrid";
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

    return (
        <div className={
            `bg-white rounded-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 ` +
            (showActions ? "shadow-xl" : "")
        } >
            {/* LEFT COLUMN */}
            <div>
                <h2 className="text-2xl font-semibold text-teal-700 mb-8">Basic Details</h2>
                <ProfileRow label="Full name" value={doctor?.fullName || "-"} />
                <ProfileRow label="Email Address" value={doctor?.email || "-"} />
                <ProfileRow label="Phone Number" value={doctor?.phone || "-"} />
                <ProfileRow label="Date Of Birth" value={doctor?.dob || "-"} />
                <ProfileRow label="Gender" value={doctor?.gender || "-"} />
                <ProfileRow label="Clinic Address" value={doctor?.address || "-"} />

                {showActions && doctor.authMethod !== "google" && (
                    <button onClick={handleClick} className="mt-8 bg-teal-600 text-white px-5 py-2 text-sm rounded-full hover:bg-teal-700 transition">
                        Change Password
                    </button>
                )}
            </div>

            {/* RIGHT COLUMN */}
            <div>
                <MedicalGrid showBio={showActions} userDetails={doctor} user={"doctor"} />
                (<button onClick={handleEditProfile} className="mt-20 bg-teal-600 text-white px-5 py-2 text-sm rounded-full hover:bg-teal-700 transition float-right">
                    Edit Profile
                </button>)

            </div>

            {/* Modal */}
            {showActions && (
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
            )}
        </div>
    )
};

export default DoctorInformation;
