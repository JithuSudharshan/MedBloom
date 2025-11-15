
export const logoutAdmin = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        console.log("Something went wrong while admin logout", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}