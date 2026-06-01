import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ENV } from '../../config/env.js';
import Transaction from '../../model/transactionModel.js';
import Patient from '../../model/patientModel.js';
import Doctor from '../../model/doctorModel.js';
import { sendNotification } from '../../utils/notificationHelper.js';

export const getTransactions = async (req, res) => {
    try {
        const userId = req.user._id; // from auth middleware
        const userRole = req.user.role; // 'patient' or 'doctor'

        const Model = userRole === 'patient' ? Patient : Doctor;
        const user = await Model.findOne({ user: userId });

        if (!user) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const transactions = await Transaction.find({ userId: user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            walletBalance: user.walletBalance || 0,
            transactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ success: false, message: "Failed to fetch wallet data" });
    }
};

export const initiateTopUp = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR
        const userId = req.user._id;
        const userRole = req.user.role;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        const Model = userRole === 'patient' ? Patient : Doctor;
        const userProfile = await Model.findOne({ user: userId });

        if (!userProfile) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_SECRET_KEY) {
            return res.status(500).json({ success: false, message: "Razorpay keys missing" });
        }

        const razorpayInstance = new Razorpay({
            key_id: ENV.RAZORPAY_KEY_ID,
            key_secret: ENV.RAZORPAY_SECRET_KEY
        });

        // Razorpay accepts amount in paise (multiply by 100)
        const orderOptions = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `rcpt_topup_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(orderOptions);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            keyId: ENV.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Error initiating top-up:", error);
        res.status(500).json({ success: false, message: "Failed to initiate top-up" });
    }
};

export const verifyTopUp = async (req, res) => {
    try {
        const { payment_id, order_id, signature, amount } = req.body; // amount in INR
        const userId = req.user._id;
        const userRole = req.user.role;

        const generatedSignature = crypto.createHmac('sha256', ENV.RAZORPAY_SECRET_KEY)
            .update(order_id + "|" + payment_id)
            .digest('hex');

        if (generatedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        const Model = userRole === 'patient' ? Patient : Doctor;
        const userProfile = await Model.findOne({ user: userId });

        // Generate Transaction ID
        const transactionId = `TXN_${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Create transaction record
        const newTransaction = new Transaction({
            transactionId,
            userId: userProfile._id,
            userModel: userRole === 'patient' ? 'Patient' : 'Doctor',
            type: 'credit',
            amount: amount,
            status: 'Success',
            description: 'Wallet Top-up',
            paymentGateway: 'razorpay',
            paymentId: payment_id
        });

        await newTransaction.save();

        // Update Wallet Balance
        userProfile.walletBalance = (userProfile.walletBalance || 0) + Number(amount);
        await userProfile.save();

        // Send Notification
        await sendNotification({
            receiverId: userProfile.user,
            message: `Your wallet has been topped up with ₹${amount}`,
            type: 'wallet_topup',
            link: `/${userRole}/wallet`
        });

        res.status(200).json({
            success: true,
            message: "Wallet topped up successfully",
            walletBalance: userProfile.walletBalance
        });

    } catch (error) {
        console.error("Error verifying top-up:", error);
        res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
};
