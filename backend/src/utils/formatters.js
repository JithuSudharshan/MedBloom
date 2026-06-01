export const formatDOB = (dateString) => {
    if (!dateString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        console.warn("Invalid DOB:", dateString);
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


export const formatName = (nameString) => {
    return nameString
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export const formatNotificationDateTime = (dateStr, timeStr) => {
    try {
        let dateObj;
        if (timeStr && timeStr.includes('T')) {
            dateObj = new Date(timeStr);
        } else if (timeStr) {
            dateObj = new Date(`${dateStr}T${timeStr}`);
        } else {
            dateObj = new Date(dateStr);
        }

        if (isNaN(dateObj.getTime())) return `${dateStr} ${timeStr || ''}`.trim();

        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', optionsDate);

        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedTime = dateObj.toLocaleTimeString('en-US', optionsTime);

        return `${formattedDate} at ${formattedTime}`;
    } catch (e) {
        return `${dateStr} ${timeStr || ''}`.trim();
    }
};
