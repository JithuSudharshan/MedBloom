
const MedicalItem = ({ label, value, unit, highlight }) => {
    const displayValue = value ? `${value} ${unit || ""}` : "-";

    return (
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className={`font-semibold ${highlight ? "text-[#00737A]" : "text-gray-800"}`}>
                {displayValue}
            </p>
        </div>
    );
};


const MedicalGrid = ({ userDetails, user, showBio }) => (

    < section >
        {user === "patient" && (
            <div>
                <div className="grid grid-cols-2 gap-x-15 gap-y-12">

                    <MedicalItem label="Blood Type" value={userDetails?.bloodType} />
                    <MedicalItem label="Cholestrol" value={userDetails?.cholesterol} unit="mmHg" />

                    <MedicalItem label="Height" value={userDetails?.height} unit="Cm" />
                    <MedicalItem label="Weight" value={userDetails?.weight} unit="kg" />

                </div>
                <div className="flex mt-10 flex-col gap-x-12 gap-y-12">

                    <MedicalItem label="Blood Pressure" value={userDetails?.bloodPressure} unit="mmHg" />
                    <MedicalItem label="Glucose level" value={userDetails?.glucoseLevel} unit="mg/dL" />

                    <MedicalItem label="Allergies" value={userDetails?.allergies} />
                    <MedicalItem label="Medical Condition" value={userDetails?.medicalCondition} />

                </div>
            </div>
        )}

        {
            user === "doctor" && (
                <div className="space-y-8">
                    {/* Short bio on top */}
                    {showBio && (
                        <div className="bg-teal-50 border border-teal-100 rounded-lg p-5">
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
                        />
                        <MedicalItem
                            label="Specialization"
                            value={userDetails?.primarySpecialization}
                            highlight
                        />
                        <MedicalItem
                            label="Years of Experience"
                            value={
                                userDetails?.yearsOfExperience
                                    ? `${userDetails.yearsOfExperience} Years`
                                    : "-"
                            }
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
                        />

                        {(userDetails?.consultationMode === "both" || userDetails?.consultationMode === "online") && (<MedicalItem
                            label="Online Consultation Fee"
                            value={
                                userDetails?.consultationFeesOnline
                                    ? `₹ ${userDetails.consultationFeesOnline}`
                                    : "-"
                            }
                        />)}

                        {(userDetails?.consultationMode === "both" || userDetails?.consultationMode === "offline") && (<MedicalItem
                            label="Offline Consultation Fee"
                            value={
                                userDetails?.consultationFeesOffline
                                    ? `₹ ${userDetails.consultationFeesOffline}`
                                    : "-"
                            }
                        />)}
                    </div>
                </div>
            )
        }
    </section>

);

export default MedicalGrid;
