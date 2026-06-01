/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axiosInstance';
import { showToast } from '../components/ui/Toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ user, children }) => {
    const [socket, setSocket] = useState(null)
    const [notifications, setNotifications] = useState([])

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // fetch existing notifications on load
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const res = await api.get('/notification?page=1&limit=15');
                setNotifications(res.data.notifications)
                setPage(1)
                setHasMore(res.data.hasMore)
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchNotifications();
    }, [user])

    const fetchMoreNotifications = async () => {
        if (!hasMore || !user) return;
        try {
            const nextPage = page + 1;
            const res = await api.get(`/notification?page=${nextPage}&limit=15`);
            setNotifications(prev => [...prev, ...res.data.notifications]);
            setPage(nextPage);
            setHasMore(res.data.hasMore);
        } catch (error) {
            console.error("Failed to fetch more notifications:", error);
        }
    }

    //  connect socket
    useEffect(() => {
        if (!user) return

        const socketUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        const s = io(socketUrl, {
            withCredentials: true,
            query: { userId: user.id || user._id }, // must match backend room id
        })

        s.on('notification', (notif) => {
            setNotifications((prev) => [notif, ...prev]);

            // Trigger Toast Alert Based on Type
            switch (notif.type) {
                case 'appointment_cancelled':
                case 'wallet_deduction':
                    showToast.error(notif.message);
                    break;
                case 'wallet_topup':
                case 'appointment_booked':
                    showToast.success(notif.message);
                    break;
                case 'video_reminder':
                case 'appointment_rescheduled':
                    // We don't have a warning toast natively, but usually info or success is fine.
                    // We'll use success since showToast has success/error/info
                    showToast.info ? showToast.info(notif.message) : showToast.success(notif.message);
                    break;
                default:
                    showToast.success(notif.message);
                    break;
            }
        });

        setSocket(s);
        return () => s.disconnect()
    }, [user])

    const markAsRead = async (id) => {
        await api.patch(`/notification/${id}/read`);
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        )
    }

    const markAllAsRead = async () => {
        await api.patch(`/notification/read-all`);
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        )
    }

    return (
        <NotificationContext.Provider
            value={{ 
                socket, 
                notifications, 
                markAsRead, 
                markAllAsRead,
                fetchMoreNotifications,
                hasMore,
                isLoading
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
};

export const useNotifications = () => useContext(NotificationContext);
