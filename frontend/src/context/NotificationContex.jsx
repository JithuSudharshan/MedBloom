import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axiosInstance';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ user, children }) => {
    const [socket, setSocket] = useState(null)
    const [notifications, setNotifications] = useState([])

    // fetch existing notifications on load
    useEffect(() => {
        if (!user) return;


        const fetchNotifications = async () => {
            const res = await api.get('/notification');
            setNotifications(res.data.notifications)
        }
        fetchNotifications();
    }, [user])

    //  connect socket
    useEffect(() => {
        if (!user) return

        const s = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
            query: { userId: user._id }, // must match backend room id
        })

        s.on('notification', (notif) => {
            setNotifications((prev) => [notif, ...prev]);
        })

        setSocket(s);
        return () => s.disconnect()
    }, [user])

    const markAsRead = async (id) => {
        await api.patch(`/notification/${id}/read`);
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        )
    }

    return (
        <NotificationContext.Provider
            value={{ socket, notifications, markAsRead }}
        >
            {children}
        </NotificationContext.Provider>
    )
};

export const useNotifications = () => useContext(NotificationContext);
