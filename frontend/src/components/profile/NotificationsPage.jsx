// pages/shared/NotificationsPage.jsx
import { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContex';
import NotificationsPanel from './NotificationPanel';

export default function NotificationsPage({ userRole = 'patient' }) {
    const { notifications, markAsRead, markAllAsRead, fetchMoreNotifications, hasMore, isLoading } = useNotifications();

    const handleClick = (n) => {
        markAsRead(n._id);
        if (n.link) {
            window.location.href = n.link;
        }
    };

    return (
        <div className="w-full h-full">
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
        </div>
    );
}
