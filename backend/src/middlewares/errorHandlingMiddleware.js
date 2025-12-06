export const handleError = (err, req, res, next) => {
    if (err)
        return res.status(500).json({ success: false, message: "Internal server error" })
}