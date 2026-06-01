// components/notifications/NotificationsPanel.jsx
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { CheckCheck } from 'lucide-react';
import { useRef, useCallback } from 'react';

export default function NotificationsPanel({
    title = 'Notifications',
    subtitle = 'Recent Notifications',
    notifications,
    onItemClick,
    onMarkAllAsRead,
    fetchMore,
    hasMore,
    isLoading,
    className = '',
    userRole = 'patient'
}) {
    const isDoctor = userRole === 'doctor';

    const observer = useRef();
    const lastNotificationElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchMore?.();
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore, fetchMore]);
    return (
        <div
            className={twMerge(
                'bg-white rounded-[32px] shadow-lg p-8 flex flex-col gap-6 w-full h-full',
                className
            )}
        >
            {/* Heading */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage your notifications
                    </p>
                </div>

                {onMarkAllAsRead && (
                    <button 
                        onClick={onMarkAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition shadow-sm"
                    >
                        <CheckCheck className="w-4 h-4 text-blue-500" />
                        <span>Mark All as Read</span>
                    </button>
                )}
            </div>

            {/* Subtitle */}
            <div className="text-sm font-semibold text-slate-600">
                {subtitle}
            </div>

            {/* Notification List */}
            <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {isLoading && notifications.length === 0 && (
                    <div className="text-sm text-slate-400 py-6 text-center">
                        Loading notifications...
                    </div>
                )}

                {!isLoading && notifications.length === 0 && (
                    <div className="text-sm text-slate-400 py-6 text-center">
                        No notifications yet.
                    </div>
                )}

                {notifications.map((n, index) => {
                    const isLast = index === notifications.length - 1;
                    
                    const getNotificationTitle = (n) => {
                        if (n.type === 'appointment_update') return 'Appointment Reminder';
                        if (n.type === 'appointment_booked') return 'Booking Confirmed';
                        if (n.type === 'appointment_cancelled') return 'Appointment Cancelled';
                        if (n.type === 'appointment_rescheduled') return 'Appointment Rescheduled';
                        if (n.type === 'wallet_topup') return 'Wallet Top-up';
                        if (n.type === 'wallet_deduction') return 'Wallet Deduction';
                        if (n.type === 'admin_approval') return 'Profile Approval Update';
                        if (n.type === 'new_message') return 'New Message';
                        if (n.type === 'video_reminder') return 'Video Consultation Reminder';

                        const msg = (n.message || '').toLowerCase();
                        if (msg.includes('wallet has been topped up')) return 'Wallet Top-up';
                        if (msg.includes('appointment') && msg.includes('confirmed')) return 'Booking Confirmed';
                        if (msg.includes('appointment') && msg.includes('cancelled')) return 'Appointment Cancelled';
                        if (msg.includes('appointment') && msg.includes('rescheduled')) return 'Appointment Rescheduled';
                        if (msg.includes('video') || msg.includes('consultation')) return 'Consultation Update';

                        return 'Notification';
                    };

                    return (
                        <button
                            key={n._id}
                            ref={isLast ? lastNotificationElementRef : null}
                            onClick={() => onItemClick?.(n)}
                            className={twMerge(
                                'w-full text-left rounded-xl px-5 py-4 border flex flex-col gap-1 transition',
                                n.read
                                    ? 'bg-slate-100 border-slate-200'
                                    : isDoctor ? 'bg-[#FCF5F5] border-[#B08B8C]/20' : 'bg-cyan-50 border-cyan-100'
                            )}
                        >
                            <div className="flex justify-between items-center w-full">
                                <span className="text-base font-semibold text-slate-800">
                                    {getNotificationTitle(n)}
                                </span>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                        {dayjs(n.timestamp).format('MMM DD, hh:mm A')}
                                    </span>
                                    <CheckCheck className={twMerge("w-4 h-4", n.read ? "text-blue-500" : "text-slate-300")} />
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed pr-8">
                                {n.message}
                            </p>
                        </button>
                    )
                })}
                
                {hasMore && notifications.length > 0 && (
                    <div className="text-center py-4 text-sm text-slate-400">
                        Loading more...
                    </div>
                )}
            </div>
        </div>

    );
}
