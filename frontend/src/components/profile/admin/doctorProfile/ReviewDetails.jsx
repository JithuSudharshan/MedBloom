import React from 'react';
import { ExternalLink, CheckCircle, XCircle, MapPin, Phone, User, Award, Clipboard } from 'lucide-react';

const ReviewDetails = ({ doctorId, doctorDetails, onReject, onApprove }) => {
    if (!doctorDetails) return <div className="p-10 text-center">Loading details...</div>;

    const {
        profilePicture, displayName, gender, contactNumber, dob,
        bio, consultationMode, specialization, subSpecialization,
        experience, registrationNumber, issuingCouncil, licenseNumber,
        clinicAddress, clinicLocation, consultationFee, certificate
    } = doctorDetails

    // Helper to render fee based on consultation mode
    const renderFees = () => {
        const mode = consultationMode?.toLowerCase();
        return (
            <div className="mt-2 space-y-1">
                {(mode === 'online' || mode === 'both') && (
                    <p className="text-sm text-gray-700">Online: <span className="font-semibold">₹{consultationFee?.online}</span></p>
                )}
                {(mode === 'offline' || mode === 'both') && (
                    <p className="text-sm text-gray-700">Offline: <span className="font-semibold">₹{consultationFee?.offline}</span></p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen">
            {/* Header / Actions Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                    <img
                        src={profilePicture || "/default-avatar.png"}
                        alt={displayName || "-"}
                        className="w-24 h-24 rounded-full object-cover border-4 border-cyan-50"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{displayName || "-"}</h1>
                        <p className="text-cyan-600 font-medium">{specialization || "-"}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending Review
                        </span>
                    </div>
                </div>

                <div className="flex space-x-3 mt-4 md:mt-0">
                    <button className="flex items-center px-6 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition shadow-sm border border-red-200"
                        onClick={() => onReject(doctorId)}
                    >
                        <XCircle className="w-5 h-5 mr-2" /> Reject
                    </button>

                    <button className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                        onClick={() => onApprove(doctorId)}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" /> Approve
                    </button>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Personal Info */}
                <div className="space-y-10">

                    <section className="bg-white p-5 rounded-xl shadow-sm        border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-cyan-500" /> Basic Info</h3>
                        <div className="space-y-3 text-sm">
                            <div><p className="text-gray-500">Gender</p><p className="font-medium capitalize">{gender || "-"}</p></div>
                            <div><p className="text-gray-500">Contact</p><p className="font-medium">{contactNumber || "-"}</p></div>
                            <div><p className="text-gray-500">Date of Birth</p><p className="font-medium">{new Date(dob).toLocaleDateString()}</p></div>
                        </div>
                    </section>

                    <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-cyan-500" /> Practice Info</h3>
                        <div className="space-y-3 text-sm">
                            <div><p className="text-gray-500">Location</p><p className="font-medium">{clinicLocation || "-"}</p></div>
                            <div><p className="text-gray-500">Address</p><p className="font-medium text-xs leading-relaxed">{clinicAddress || "-"}</p></div>
                            <div><p className="text-gray-500">Consultation Fees</p>{renderFees()}</div>
                        </div>
                    </section>

                </div>

                {/* Right Column: Professional Verification */}
                <div className="md:col-span-2 space-y-6">

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 flex items-center"><Award className="w-5 h-5 mr-2 text-cyan-500" /> Credentials</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div><p className="text-gray-500 text-sm">Experience</p><p className="font-medium">{experience || "-"} Years</p></div>
                            <div><p className="text-gray-500 text-sm">Sub-Specializations</p><p className="font-medium">{subSpecialization || "None"}</p></div>
                            <div><p className="text-gray-500 text-sm">Registration No.</p><p className="font-medium">{registrationNumber || "-"}</p></div>
                            <div><p className="text-gray-500 text-sm">License No.</p><p className="font-medium">{licenseNumber || "-"}</p></div>
                            <div className="sm:col-span-2"><p className="text-gray-500 text-sm">Issuing Council</p><p className="font-medium">{issuingCouncil || "-"}</p></div>
                        </div>

                        <div className="mt-6 p-4 bg-cyan-50 rounded-lg flex justify-between items-center border border-cyan-100">
                            <div>
                                <p className="font-semibold text-cyan-800">Medical Council Registration Certificate</p>
                                <p className="text-xs text-cyan-700">Click to verify professional license in a new tab</p>
                            </div>
                            <a
                                href={certificate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-cyan-100 text-cyan-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center hover:bg-white transition"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" /> View Certificate
                            </a>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 flex items-center"><Clipboard className="w-5 h-5 mr-2 text-cyan-500" /> Biography</h3>
                        <p className="text-gray-700 text-sm leading-relaxed italic">"{bio || "-"}"</p>
                    </section>

                </div>
            </div>
        </div>
    );
}

export default ReviewDetails;
