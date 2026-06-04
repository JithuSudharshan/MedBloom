
const MedicalItem = ({ label, value, unit, highlight, isDoctor }) => {
    const displayValue = value ? `${value} ${unit || ""}` : "-";

    return (
        <div className="flex flex-col w-full">
            <p className="text-gray-400 mb-1 text-[11px] sm:text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className={`font-bold text-sm sm:text-base ${highlight ? (isDoctor ? "text-[#6B3B3D]" : "text-[#00737A]") : "text-gray-800"}`}>
                {displayValue}
            </p>
        </div>
    );
};


const MedicalGrid = ({ userDetails, user, showBio }) => (

    < section >
        {user === "patient" && (
            <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-teal-100/60 shadow-sm flex flex-col items-center justify-center text-center">
                        <MedicalItem label="Blood Type" value={userDetails?.bloodType} />
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-teal-100/60 shadow-sm flex flex-col items-center justify-center text-center">
                        <MedicalItem label="Cholesterol" value={userDetails?.cholesterol} unit="mmHg" />
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-teal-100/60 shadow-sm flex flex-col items-center justify-center text-center">
                        <MedicalItem label="Height" value={userDetails?.height} unit="Cm" />
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-teal-100/60 shadow-sm flex flex-col items-center justify-center text-center">
                        <MedicalItem label="Weight" value={userDetails?.weight} unit="kg" />
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-teal-100/60 shadow-sm flex flex-col items-center justify-center text-center">
                        <MedicalItem label="Blood Pressure" value={userDetails?.bloodPressure} unit="mmHg" />
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-teal-100/60 shadow-sm flex flex-col items-center justify-center text-center">
                        <MedicalItem label="Glucose Level" value={userDetails?.glucoseLevel} unit="mg/dL" />
                    </div>
                </div>

                <div className="flex mt-12 flex-col gap-y-8">
                    <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100">
                        <h4 className="text-[#008C89] font-medium mb-6">Conditions & Allergies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <MedicalItem label="Allergies" value={userDetails?.allergies} />
                            <MedicalItem label="Medical Condition" value={userDetails?.medicalCondition} />
                            <MedicalItem label="Food/Drug Intolerances" value={userDetails?.Food_or_Drug_Intolerances} />
                            <MedicalItem label="Mental Health History" value={userDetails?.Mental_Health_History} />
                        </div>
                    </div>

                    <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100">
                        <h4 className="text-[#008C89] font-medium mb-6">Lifestyle Habits</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <MedicalItem label="Smoking" value={userDetails?.smoking} />
                            <MedicalItem label="Drinking" value={userDetails?.drinking} />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {
            user === "doctor" && (
                <div className="space-y-8">
                    {/* Short bio on top */}
                    {showBio && (
                        <div className="bg-[#F8E9EA] border border-[#B08B8C]/20 rounded-lg p-5">
                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                                Short bio
                            </p>
                            <p className="flex text-gray-800 leading-relaxed text-sm wrap-anywhere ">
                                {userDetails?.shortBio || "No bio added yet."}
                            </p>
                        </div>
                    )}


                    {/* Professional + consultation details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-20">
                        <MedicalItem
                            label="Display Name"
                            value={userDetails?.displayName || userDetails?.fullName}
                            highlight
                            isDoctor={user === "doctor"}
                        />
                        <MedicalItem
                            label="Specialization"
                            value={userDetails?.primarySpecialization}
                            highlight
                            isDoctor={user === "doctor"}
                        />
                        <MedicalItem
                            label="Years of Experience"
                            value={
                                userDetails?.yearsOfExperience
                                    ? `${userDetails.yearsOfExperience} Years`
                                    : "-"
                            }
                            isDoctor={user === "doctor"}
                        />

                        <MedicalItem
                            label="Consultation Mode"
                            value={
                                userDetails?.consultationMode === "both"
                                    ? "Online & Offline"
                                    : userDetails?.consultationMode === "online"
                                        ? "Online"
                                        : userDetails?.consultationMode === "offline"
                                            ? "Offline"
                                            : "-"
                            }
                            isDoctor={user === "doctor"}
                        />

                        {(userDetails?.consultationMode === "both" || userDetails?.consultationMode === "online") && (<MedicalItem
                            label="Online Consultation Fee"
                            value={
                                userDetails?.consultationFeesOnline
                                    ? `₹ ${userDetails.consultationFeesOnline}`
                                    : "-"
                            }
                            isDoctor={user === "doctor"}
                        />)}

                        {(userDetails?.consultationMode === "both" || userDetails?.consultationMode === "offline") && (<MedicalItem
                            label="Offline Consultation Fee"
                            value={
                                userDetails?.consultationFeesOffline
                                    ? `₹ ${userDetails.consultationFeesOffline}`
                                    : "-"
                            }
                            isDoctor={user === "doctor"}
                        />)}
                    </div>
                </div>
            )
        }
    </section>

);

export default MedicalGrid;
