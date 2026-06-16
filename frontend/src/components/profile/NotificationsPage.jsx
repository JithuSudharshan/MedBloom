// pages/shared/NotificationsPage.jsx
import { useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContex';
import NotificationsPanel from './NotificationPanel';
import InquiryDetailModal from './admin/InquiryDetailModal';
import { fetchEnquiryById } from '../../api/adminApi';
import { showToast } from '../ui/Toast';

export default function NotificationsPage({ userRole = 'patient' }) {
    const { notifications, markAsRead, markAllAsRead, fetchMoreNotifications, hasMore, isLoading } = useNotifications();
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [selectedNotif, setSelectedNotif] = useState(null);

    const handleClick = async (n) => {
        markAsRead(n._id);
        
        // Prevent default navigation for contact_inquiry
        if (n.type === 'contact_inquiry') {
            if (n.metadata?.enquiryId) {
                try {
                    const res = await fetchEnquiryById(n.metadata.enquiryId);
                    if (res.data?.success) {
                        setSelectedInquiry(res.data.data);
                        setSelectedNotif(n);
                    }
                } catch (e) {
                    console.error("Failed to fetch enquiry:", e);
                    showToast.error("Could not load inquiry details.");
                }
            } else {
                // Handle legacy notifications that were created before the metadata field existed
                showToast.info("Detailed data is not available for this older inquiry.");
            }
            return; // GUARANTEE we never navigate away
        }

        if (n.link) {
            window.location.href = n.link;
        }
    };

    return (
        <div className="w-full h-full relative">
            <NotificationsPanel
                title="Notifications"
                subtitle="Recent Notifications"
                notifications={notifications}
                onItemClick={handleClick}
                onMarkAllAsRead={markAllAsRead}
                fetchMore={fetchMoreNotifications}
                hasMore={hasMore}
                isLoading={isLoading}
                className="w-full"
                userRole={userRole}
            />
            
            {selectedInquiry && (
                <InquiryDetailModal
                    enquiry={selectedInquiry}
                    notification={selectedNotif}
                    onClose={() => { setSelectedInquiry(null); setSelectedNotif(null); }}
                />
            )}
        </div>
    );
}
