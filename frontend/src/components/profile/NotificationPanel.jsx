// components/notifications/NotificationsPanel.jsx
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';
import { CheckCheck, Wallet, CalendarClock, Video, ShieldCheck, MessageSquare, Bell, Mail } from 'lucide-react';
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
    const roleThemes = {
        admin: {
            bg: 'bg-teal-50/50',
            border: 'border-teal-500',
            text: 'text-teal-800',
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600',
            btnHover: 'hover:bg-teal-50',
            btnText: 'text-teal-600',
            btnIcon: 'text-teal-500'
        },
        doctor: {
            bg: 'bg-rose-50/50',
            border: 'border-rose-500',
            text: 'text-rose-800',
            iconBg: 'bg-rose-100',
            iconColor: 'text-rose-600',
            btnHover: 'hover:bg-rose-50',
            btnText: 'text-rose-600',
            btnIcon: 'text-rose-500'
        },
        patient: {
            bg: 'bg-cyan-50/50',
            border: 'border-cyan-500',
            text: 'text-cyan-800',
            iconBg: 'bg-cyan-100',
            iconColor: 'text-cyan-600',
            btnHover: 'hover:bg-cyan-50',
            btnText: 'text-cyan-600',
            btnIcon: 'text-cyan-500'
        }
    };

    const currentTheme = roleThemes[userRole] || roleThemes.patient;

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
                'bg-white rounded-[2rem] sm:rounded-[32px] shadow-lg p-5 sm:p-8 flex flex-col gap-4 sm:gap-6 w-full h-full',
                className
            )}
        >
            {/* Heading */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className={twMerge("text-2xl font-bold tracking-tight", currentTheme.text)}>{title}</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Manage your notifications
                    </p>
                </div>

                {onMarkAllAsRead && (
                    <button 
                        onClick={onMarkAllAsRead}
                        className={twMerge(
                            "flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold transition shadow-sm bg-white",
                            currentTheme.btnText,
                            currentTheme.btnHover
                        )}
                    >
                        <CheckCheck className={twMerge("w-4 h-4", currentTheme.btnIcon)} />
                        <span>Mark All as Read</span>
                    </button>
                )}
            </div>

            {/* Subtitle */}
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {subtitle}
            </div>

            {/* Notification List */}
            <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {isLoading && notifications.length === 0 && (
                    <div className="text-sm font-medium text-slate-400 py-10 text-center animate-pulse">
                        Loading notifications...
                    </div>
                )}

                {!isLoading && notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                            <Bell className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">
                            No notifications yet.
                        </p>
                    </div>
                )}

                {notifications.map((n, index) => {
                    const isLast = index === notifications.length - 1;
                    
                    const getNotificationDetails = (n) => {
                        let nTitle = 'Notification';
                        let Icon = Bell;
                        
                        if (n.type === 'appointment_update' || n.type === 'appointment_booked' || n.type === 'appointment_cancelled' || n.type === 'appointment_rescheduled') {
                            Icon = CalendarClock;
                            if (n.type === 'appointment_update') nTitle = 'Appointment Reminder';
                            if (n.type === 'appointment_booked') nTitle = 'Booking Confirmed';
                            if (n.type === 'appointment_cancelled') nTitle = 'Appointment Cancelled';
                            if (n.type === 'appointment_rescheduled') nTitle = 'Appointment Rescheduled';
                        } else if (n.type === 'wallet_topup' || n.type === 'wallet_deduction') {
                            Icon = Wallet;
                            nTitle = n.type === 'wallet_topup' ? 'Wallet Top-up' : 'Wallet Deduction';
                        } else if (n.type === 'admin_approval') {
                            Icon = ShieldCheck;
                            nTitle = 'Profile Approval Update';
                        } else if (n.type === 'new_message') {
                            Icon = MessageSquare;
                            nTitle = 'New Message';
                        } else if (n.type === 'video_reminder') {
                            Icon = Video;
                            nTitle = 'Video Consultation Reminder';
                        } else if (n.type === 'contact_inquiry') {
                            Icon = Mail;
                            nTitle = 'Contact Inquiry';
                        } else {
                            const msg = (n.message || '').toLowerCase();
                            if (msg.includes('wallet has been topped up') || msg.includes('wallet deduction')) { nTitle = 'Wallet Update'; Icon = Wallet; }
                            else if (msg.includes('appointment') && msg.includes('confirmed')) { nTitle = 'Booking Confirmed'; Icon = CalendarClock; }
                            else if (msg.includes('appointment') && msg.includes('cancelled')) { nTitle = 'Appointment Cancelled'; Icon = CalendarClock; }
                            else if (msg.includes('appointment') && msg.includes('rescheduled')) { nTitle = 'Appointment Rescheduled'; Icon = CalendarClock; }
                            else if (msg.includes('video') || msg.includes('consultation')) { nTitle = 'Consultation Update'; Icon = Video; }
                        }
                        
                        return { nTitle, Icon };
                    };
                    
                    const { nTitle, Icon } = getNotificationDetails(n);

                    return (
                        <button
                            key={n._id}
                            ref={isLast ? lastNotificationElementRef : null}
                            onClick={() => onItemClick?.(n)}
                            className={twMerge(
                                'w-full text-left rounded-[1rem] sm:rounded-2xl p-4 sm:p-5 border flex gap-3 sm:gap-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md',
                                n.read
                                    ? 'bg-white border-slate-200 shadow-sm'
                                    : `${currentTheme.bg} border-slate-100 border-l-[4px] sm:border-l-[6px] ${currentTheme.border} shadow-sm`
                            )}
                        >
                            <div className={twMerge(
                                "mt-0.5 w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center transition-colors", 
                                n.read ? "bg-slate-50 text-slate-400 border border-slate-100" : `${currentTheme.iconBg} ${currentTheme.iconColor}`
                            )}>
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                            </div>
                            
                            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                                <div className="flex justify-between items-start w-full gap-2">
                                    <span className={twMerge(
                                        "text-[15px] sm:text-base font-bold truncate", 
                                        n.read ? "text-slate-600" : currentTheme.text
                                    )}>
                                        {nTitle}
                                    </span>
                                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
                                            {dayjs(n.timestamp).format('MMM DD, hh:mm A')}
                                        </span>
                                        <CheckCheck className={twMerge("w-4 h-4", n.read ? "text-blue-500" : "text-slate-300")} />
                                    </div>
                                </div>
                                <p className={twMerge(
                                    "text-[13px] sm:text-sm leading-relaxed", 
                                    n.read ? "text-slate-500" : "text-slate-700 font-medium"
                                )}>
                                    {n.message}
                                </p>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest sm:hidden mt-1">
                                    {dayjs(n.timestamp).format('MMM DD, hh:mm A')}
                                </span>
                            </div>
                        </button>
                    )
                })}
                
                {hasMore && notifications.length > 0 && (
                    <div className="text-center py-6 text-sm font-medium text-slate-400 animate-pulse">
                        Loading more...
                    </div>
                )}
            </div>
        </div>
    );
}
