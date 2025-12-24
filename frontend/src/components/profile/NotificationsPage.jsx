// pages/shared/NotificationsPage.jsx
import { useNotifications } from '../../context/NotificationContex';
import NotificationsPanel from './NotificationPanel';

export default function NotificationsPage({ profileTitle = 'Doctor Profile' }) {
    const { notifications, markAsRead } = useNotifications();

    const handleClick = (n) => {
        markAsRead(n._id);
        if (n.link) {
            window.location.href = n.link;
        }
    };

    return (
        <div className="flex gap-6">
            <div className="flex-1">
                <NotificationsPanel
                    title="Notifications"
                    subtitle="Recent Notifications"
                    notifications={notifications}
                    onItemClick={handleClick}
                />
            </div>
        </div>
    );
}
