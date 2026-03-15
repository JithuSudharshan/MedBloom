import { Users, UserPlus, Activity } from "lucide-react";

export const PatientStats = ({ patientCount, newPatients, activeVisit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

      {/* Total Patients */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
        <div className="p-3 bg-teal-50 rounded-xl">
          <Users className="w-6 h-6 text-teal-600" />
        </div>

        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Total Patients
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none mt-1">
            {patientCount}
          </p>
        </div>
      </div>

      {/* New Patients */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
        <div className="p-3 bg-teal-50 rounded-xl">
          <UserPlus className="w-6 h-6 text-teal-600" />
        </div>

        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            New This Month
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none mt-1">
            {newPatients}
          </p>
        </div>
      </div>

      {/* Active Visits */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
        <div className="p-3 bg-teal-50 rounded-xl">
          <Activity className="w-6 h-6 text-teal-600" />
        </div>

        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Active Visits
          </p>
          <p className="text-3xl font-bold text-gray-900 leading-none mt-1">
            {activeVisit}
          </p>
        </div>
      </div>

    </div>
  );
};