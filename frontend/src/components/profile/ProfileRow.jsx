const ProfileRow = ({ label, value }) => (
    <div className=" mb-10 ">
        <p className="text-gray-400 mb-2 text-sm font-medium">{label}</p>
        <p className="text-gray-800 font-semibold">{value}</p>
    </div>
);

export default ProfileRow;
