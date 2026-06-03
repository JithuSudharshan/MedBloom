import Admin from "../../../model/adminModel.js";
import Transaction from "../../../model/transactionModel.js";

export const getAdminWallet = async (req, res) => {
    try {
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const transactions = await Transaction.find({
            userModel: 'Admin',
            userId: admin._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                walletBalance: admin.walletBalance || 0,
                transactions
            }
        });
    } catch (error) {
        console.error("Error fetching admin wallet:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
