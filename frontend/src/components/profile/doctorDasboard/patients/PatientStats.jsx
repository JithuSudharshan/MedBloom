import React from 'react';
import { Users, UserPlus, Clock } from 'lucide-react';

export const PatientStats = ({ patientCount, newPatients, activeVisit }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Patients Card */}
            <div className="bg-white rounded-2xl p-6 border border-teal-100 shadow-[0_2px_10px_-3px_rgba(0,164,163,0.1)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,164,163,0.15)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Unique Patients</p>
                    <h3 className="text-2xl font-bold text-gray-800">{patientCount || 0}</h3>
                </div>
            </div>

            {/* New Patients Card */}
            <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-[0_2px_10px_-3px_rgba(59,130,246,0.1)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.15)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
                    <UserPlus size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">New Patients (This Month)</p>
                    <h3 className="text-2xl font-bold text-gray-800">{newPatients || 0}</h3>
                </div>
            </div>

            {/* Active Visits Card */}
            <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.1)] transition-all hover:shadow-[0_8px_30px_-4px_rgba(244,63,94,0.15)] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-500">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Visits (Today)</p>
                    <h3 className="text-2xl font-bold text-gray-800">{activeVisit || 0}</h3>
                </div>
            </div>
        </div>
    );
};
