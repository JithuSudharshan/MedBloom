// components/profile/DoctorApprovalList.jsx
import { useEffect, useState } from "react";
import { Pagination } from "../ui/Pagination";
import { DoctorApprovalCard } from "./DoctorApprovalCard";
import { acceptDoctor, fetchDoctorsList, rejectDoctor } from "../../api/adminApi";
import { showToast } from "../ui/Toast";
import Loader from "../ui/Loading";
import { useNavigate } from "react-router-dom";

const DoctorApprovalList = ({ onBack }) => {
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isApproving, setIsApproving] = useState(false)
    const [isRejecting, setIsRejecteing] = useState(false)
    const navigate = useNavigate()

    const fetchPendingDoctors = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await fetchDoctorsList({
                params: { page: pageNumber, limit: 5 }
            })

            if (!res.data?.success) {
                showToast.error("Something went wrong while fetching data")
            }

            const { doctors, page, totalPages } = res?.data?.data;

            setDoctors(doctors);
            setPage(page);
            setTotalPages(totalPages);
        } catch (err) {
            console.error("Failed to load pending doctors:", err);
            showToast.error("Something  wrong while fetching data")
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDoctors(page);
    }, [page]);


    // handle Approving Doctor
    const handleApprove = async (id) => {

        try {

            setIsApproving(true)

            const response = await acceptDoctor(id);

            if (!response?.data?.success) {
                showToast.error(response?.data?.message)
            }
            setDoctors((prev) => prev.filter((d) => d._id !== id))
            showToast.success(response?.data?.message)

        } catch (error) {
            showToast.error("something went wrong")
        } finally {
            setIsApproving(false)
        }


    };

    // handling Rejecting Doctor
    const handleReject = async (id) => {

        try {
            setIsRejecteing(true)

            const response = await rejectDoctor(id)

            if (!response?.data?.success) {
                showToast.error(response?.data?.message)
            }
            setDoctors((prev) => prev.filter((d) => d._id !== id))
            showToast.success(response?.data?.message)
        } catch (error) {
            showToast.error("Something went wrong")
        } finally {
            setIsRejecteing(false)
        }

    };

    const handleReviewApplication = (doctor) => {
        navigate(`/admin/doctor/review/${doctor._id}`)
    }

    if (doctors === null) return <Loader />

    return (
        <div className="space-y-6">
            {/* Header row with back + filter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Requests for Approval
                    </h1>
                </div>

                <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                    <span className="text-slate-400">✕</span>
                    <span>Filter</span>
                </button>
            </div>

            {/* List of pending doctors */}
            <div className="mt-2">
                {doctors.map((doctor) => (
                    <DoctorApprovalCard
                        isApproving={isApproving}
                        isRejecting={isRejecting}
                        key={doctor._id}
                        doctor={doctor}
                        onApprove={() => handleApprove(doctor._id)}
                        onReject={() => handleReject(doctor._id)}
                        viewDetails={handleReviewApplication}
                    />
                ))}
            </div>

            <Pagination current={page} total={totalPages} onChange={setPage} />

        </div>
    );
};

export default DoctorApprovalList;
