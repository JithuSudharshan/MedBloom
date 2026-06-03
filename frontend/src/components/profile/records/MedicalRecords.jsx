import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Filter, Eye, Download, MoreVertical, Search, FileText, Activity, HeartPulse, Stethoscope, FilePlus, Loader2, Edit2, Trash2 } from 'lucide-react';
import UploadRecordModal from './UploadRecordModal';
import { fetchMedicalRecords, deleteMedicalRecord } from '../../../api/patientApi';
import { showToast } from '../../ui/Toast';
import { Pagination } from '../../ui/Pagination';
import ViewPrescriptionModal from '../appointments/ViewPrescriptionModal';

const CATEGORY_ICONS = {
    lab: { icon: Activity, colorClass: "text-teal-600 bg-teal-100" },
    imaging: { icon: HeartPulse, colorClass: "text-blue-600 bg-blue-100" },
    prescription: { icon: Stethoscope, colorClass: "text-purple-600 bg-purple-100" },
    other: { icon: FilePlus, colorClass: "text-orange-600 bg-orange-100" }
};

const MedicalRecords = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 5;
    
    // 3-Dots Menu
    const [openMenuId, setOpenMenuId] = useState(null);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // View Prescription Modal
    const [isViewPrescriptionOpen, setIsViewPrescriptionOpen] = useState(false);
    const [appointmentToView, setAppointmentToView] = useState(null);

    const loadRecords = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: ITEMS_PER_PAGE
            };
            if (activeCategory !== 'all') params.category = activeCategory;
            if (searchQuery.trim() !== '') params.search = searchQuery;

            const res = await fetchMedicalRecords(params);
            if (res?.data?.success) {
                setRecords(res.data.records);
                setTotalPages(res.data.totalPages || 1);
            }
        } catch (error) {
            console.error("Failed to fetch records:", error);
            showToast.error("Failed to load medical records");
        } finally {
            setLoading(false);
        }
    }, [activeCategory, searchQuery, currentPage]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadRecords();
        }, 300); // 300ms debounce for search
        return () => clearTimeout(debounce);
    }, [loadRecords]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchQuery]);

    // Close 3-dots menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const confirmDelete = async () => {
        if (!recordToDelete) return;
        
        try {
            setIsDeleting(true);
            const res = await deleteMedicalRecord(recordToDelete._id);
            if (res?.data?.success) {
                showToast.success("Record deleted successfully");
                setRecords(records.filter(r => r._id !== recordToDelete._id));
            }
        } catch (error) {
            console.error("Delete failed:", error);
            showToast.error("Failed to delete record");
        } finally {
            setIsDeleting(false);
            setRecordToDelete(null);
        }
    };

    const handleDownload = (url, filename) => {
        if (!url) {
            showToast.error("This is a digital record and cannot be downloaded as a file directly.");
            return;
        }
        try {
            // If it's a Cloudinary URL, append fl_attachment to force download
            let downloadUrl = url;
            if (url.includes('cloudinary.com') && url.includes('/upload/')) {
                // Ensure valid filename without spaces or weird chars for the attachment name
                const safeName = filename.replace(/[^a-zA-Z0-9]/g, '_');
                downloadUrl = url.replace('/upload/', `/upload/fl_attachment:${safeName}/`);
            }
            
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename || "medbloom_record";
            link.target = "_blank"; // Fallback if browser tries to open it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            showToast.error("Failed to initiate download");
            if (url) window.open(url, '_blank');
        }
    };

    const handleView = (record) => {
        if (record.isDigital && record.appointmentId) {
            // Map the appointmentId raw mongoose doc to what ViewPrescriptionModal expects
            const appt = record.appointmentId;
            
            // Format date and time
            let formattedDate = appt.date;
            try {
                const dateObj = new Date(appt.date);
                formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            } catch(e) {}

            let formattedTime = appt.startTime;
            try {
                const timeObj = new Date(appt.startTime);
                if (!isNaN(timeObj.getTime())) {
                    formattedTime = timeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
                }
            } catch(e) {}

            const mappedAppointment = {
                id: appt._id,
                appointmentId: appt.appointmentId,
                doctorName: appt.doctor?.user?.name ? `Dr. ${appt.doctor.user.name}` : "Doctor",
                speciality: appt.doctor?.primarySpecialization || "Specialist",
                primaryTitle: "You", // Patient is viewing their own record
                dateTimeLabel: `${formattedDate}  ${formattedTime}`,
                rawDate: appt.date,
                prescription: appt.prescription,
                notes: appt.notes
            };
            
            setAppointmentToView(mappedAppointment);
            setIsViewPrescriptionOpen(true);
        } else if (record.fileUrl) {
            window.open(record.fileUrl, '_blank');
        } else {
            showToast.error("Could not open this record.");
        }
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const categories = [
        { id: 'all', label: 'All Records' },
        { id: 'lab', label: 'Lab Reports' },
        { id: 'imaging', label: 'Imaging' },
        { id: 'prescription', label: 'Prescriptions' },
        { id: 'other', label: 'Other' }
    ];

    return (
        <div className="w-full flex flex-col gap-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className=" text-2xl font-bold text-gray-800">Personal Health Documents</h1>

                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 bg-[#00A4A3] hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Upload New Record
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">

                {/* Filters (Pill Tabs) */}
                <div className="flex overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 gap-2 hide-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                activeCategory === cat.id 
                                ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Search Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search records by title or description..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A4A3]/20 focus:border-[#00A4A3] transition-all"
                        />
                    </div>
                </div>

                {/* Records List */}
                <div className="flex flex-col gap-4 min-h-[300px]">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#00A4A3]" />
                            <p>Loading your records...</p>
                        </div>
                    ) : (
                        <>
                            {records.map((record) => {
                                const catConfig = CATEGORY_ICONS[record.category] || CATEGORY_ICONS.other;
                                const Icon = catConfig.icon;
                                
                                return (
                                    <div key={record._id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-teal-100 hover:shadow-md bg-white transition-all duration-200 relative">

                                        {/* Icon Container */}
                                        <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center ${catConfig.colorClass}`}>
                                            <Icon className="w-7 h-7" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <h3 className="text-gray-900 font-semibold text-base truncate">{record.title}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    {categories.find(c => c.id === record.category)?.label || record.category}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-gray-500 text-xs">
                                                    {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-gray-500 text-xs">{(record.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                            {record.description && (
                                                <p className="text-gray-600 text-sm mt-1.5 line-clamp-1">{record.description}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-4 sm:mt-0 self-end sm:self-center">
                                            <button 
                                                onClick={() => handleView(record)}
                                                className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors tooltip-trigger relative" 

                                                title="View Document"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            {!record.isDigital && (
                                                <button 
                                                    onClick={() => handleDownload(record.fileUrl, record.title)}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors tooltip-trigger relative" 
                                                    title="Download"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            )}
                                            
                                            {/* 3-Dots Menu Container */}
                                            <div className="relative">
                                                <button 
                                                    onClick={(e) => toggleMenu(e, record._id)}
                                                    className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                                
                                                {/* Dropdown Menu */}
                                                {openMenuId === record._id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in slide-in-from-top-2 duration-100">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleView(record); setOpenMenuId(null); }}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-400" /> View Document
                                                        </button>
                                                        {!record.isDigital && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleDownload(record.fileUrl, record.title); setOpenMenuId(null); }}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <Download className="w-4 h-4 text-gray-400" /> Download
                                                            </button>
                                                        )}
                                                        <div className="h-px bg-gray-100 my-1"></div>
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                setRecordToDelete(record); 
                                                                setOpenMenuId(null); 
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-400" /> Delete Record
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {!loading && records.length === 0 && (
                                <div className="py-16 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-5">
                                        <FileText className="w-10 h-10 text-teal-300" />
                                    </div>
                                    <h3 className="text-gray-900 font-semibold text-xl mb-2">No records found</h3>
                                    <p className="text-gray-500 text-sm max-w-sm mb-6">
                                        {searchQuery || activeCategory !== 'all' 
                                            ? "We couldn't find any documents matching your current filters." 
                                            : "You haven't uploaded any medical records yet. Click the button above to add your first document."}
                                    </p>
                                    {(searchQuery || activeCategory !== 'all') && (
                                        <button 
                                            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                            className="text-[#00A4A3] font-medium hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
                
                {/* Pagination */}
                {!loading && records.length > 0 && totalPages > 1 && (
                    <div className="pt-4 border-t border-gray-100 mt-2">
                        <Pagination 
                            current={currentPage}
                            total={totalPages}
                            onChange={setCurrentPage}
                            userRole="patient"
                        />
                    </div>
                )}
            </div>

            <UploadRecordModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={() => loadRecords()}
            />

            {/* View Prescription Modal */}
            <ViewPrescriptionModal
                isOpen={isViewPrescriptionOpen}
                onClose={() => {
                    setIsViewPrescriptionOpen(false);
                    setAppointmentToView(null);
                }}
                appointment={appointmentToView}
            />

            {/* Custom Delete Confirmation Modal */}
            {recordToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Document?</h2>
                        <p className="text-gray-500 text-center text-sm mb-6">
                            Are you sure you want to delete <span className="font-semibold text-gray-700">"{recordToDelete.title}"</span>? This action cannot be undone and it will be permanently removed from your records.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setRecordToDelete(null)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-sm shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Record"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecords;
