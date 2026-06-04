const ProfileRow = ({ label, value }) => (
    <div className="flex flex-col">
        <p className="text-gray-400 mb-1 text-sm font-medium uppercase tracking-wider">{label}</p>
        <p className="text-gray-800 font-semibold break-words">{value || "-"}</p>
    </div>
);

export default ProfileRow;
