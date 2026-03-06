// components/notifications/NotificationsPanel.jsx
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export default function NotificationsPanel({
    title = 'Notifications',
    subtitle = 'Recent Notifications',
    notifications,
    onItemClick,
    className = ''
}) {
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

                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-sm text-slate-600 bg-white hover:bg-slate-50 transition">
                    <span>Filter</span>
                </button>
            </div>

            {/* Subtitle */}
            <div className="text-sm font-semibold text-slate-600">
                {subtitle}
            </div>

            {/* Notification List */}
            <div className="flex flex-col gap-4">
                {notifications.length === 0 && (
                    <div className="text-sm text-slate-400 py-6 text-center">
                        No notifications yet.
                    </div>
                )}

                {notifications.map((n) => (
                    <button
                        key={n._id}
                        onClick={() => onItemClick?.(n)}
                        className={twMerge(
                            'w-full text-left rounded-xl px-5 py-4 border flex flex-col gap-1 transition',
                            n.read
                                ? 'bg-slate-100 border-slate-200'
                                : 'bg-cyan-50 border-cyan-100'
                        )}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-slate-800">
                                {n.type === 'appointment_update' && 'Appointment Reminder'}
                                {n.type === 'admin_approval' && 'Profile Approval Update'}
                                {n.type === 'new_message' && 'New Message'}
                                {!['appointment_update', 'admin_approval', 'new_message'].includes(n.type) &&
                                    'Notification'}
                            </span>

                            <span className="text-xs text-slate-500">
                                {dayjs(n.timestamp).format('MMM DD, hh:mm A')}
                            </span>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">
                            {n.message}
                        </p>
                    </button>
                ))}
            </div>
        </div>

    );
}
