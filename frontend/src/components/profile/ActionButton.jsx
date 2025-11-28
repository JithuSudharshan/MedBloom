const ActionButton = ({ label, onClick, variant }) => (
    <button
        className={`px-6 py-2 rounded-full text-white font-medium shadow transition ${variant === "primary" ? "bg-teal-600 hover:bg-teal-700" : "bg-blue-500 hover:bg-blue-600"
            }`}
        onClick={onClick}
    >
        {label}
    </button>
);
export default ActionButton;
