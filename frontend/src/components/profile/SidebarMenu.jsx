const SidebarMenu = ({ menu, src, alt, name, activeKey, onChange, onLogout, isLoggingOut }) => (
    <nav className="bg-white w-64 ml-10 rounded-3xl shadow-lg p-6 mt-15 flex flex-col gap-2">

        <div className="flex flex-col items-center gap-3 py-6">
            <img src={src} alt={alt} className="rounded-full w-40 h-40 object-cover shadow" />
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
