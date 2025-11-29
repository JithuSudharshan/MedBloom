const SidebarMenu = ({ menu, src, alt, name, activeKey, onChange, onLogout, isLoggingOut, onEditAvatar, }) => (

    <nav className="bg-white w-64 ml-10 rounded-3xl shadow-lg p-6 mt-15 flex flex-col gap-2">

        <div className="flex flex-col items-center gap-3 py-6">
            <div className="relative">
                <img
                    src={src}
                    alt={alt}
                    className="rounded-full w-40 h-40 object-cover shadow"
                />
                <button
                    type="button"
                    onClick={onEditAvatar}
                    className="absolute bottom-1 right-1 flex items-center justify-center
                     w-9 h-9 rounded-full bg-white shadow-md border border-gray-200
                     hover:bg-gray-100 transition"
                >
                    {/* simple pencil icon using SVG; replace with lucide/heroicons if you use them */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path d="M16.862 3.487a2.25 2.25 0 013.182 3.182L8.25 18.463 4.5 19.5l1.037-3.75L16.862 3.487z" />
                    </svg>
                </button>
            </div>
            <div className="font-medium text-lg text-gray-700">{name}</div>
        </div>


        <ul className="flex flex-col gap-4">
            {menu.map(item => {
                const Icon = item.icon
                const isActive = item.key === activeKey
                const isLogout = item.key === "logout"

                const base = "flex items-center gap-3 rounded-xl cursor-pointer transition-colors"
                const color = isActive ?
                    "bg-[#DBFFFF] text-[#006C73]"
                    :
                    "text-gray-400 hover:bg-teal-50 hover:text-teal-600";

                const handleClick = () => {
                    if (isLogout && onLogout) onLogout()
                    else if (onChange) onChange(item.key)
                }

                return (
                    <li key={item.key}>
                        <button
                            type="button"
                            onClick={handleClick}
                            className={`${base} ${color} px-5 py-3 w-full text-left`}
                        >
                            {Icon && <Icon className="w-5 h-5" />}
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    </li>
                )
            })}
        </ul>
    </nav>
);

export default SidebarMenu;
