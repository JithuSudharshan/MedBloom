import Enquiry from "../../../model/enquirySchema.js";
import Notification from "../../../model/notificationSchema.js";
import Admin from "../../../model/adminModel.js";
import { getIO } from "../../../config/socket.IO.js";

export const saveEnquiry = async (req, res) => {
    try {
        const { name, email, phone } = req.body

        if (!name || !email || !phone)
            return res.status(400).json({ success: false, message: "Please do fill all fields" })

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ success: false, message: "Invalid email format" })

        const newEnquiry = new Enquiry({
            name,
            email,
            phone
        })

        const response = await newEnquiry.save()

        if (response) {
            console.log("[saveEnquiry] Enquiry saved, searching for admins...");
            // Find all admin users from the Admin collection
            const admins = await Admin.find({}).select('_id').lean();
            console.log(`[saveEnquiry] Found ${admins.length} admins:`, admins);

            // Create + emit notifications for each admin
            if (admins.length > 0) {
                try {
                    const io = getIO();
                    
                    const notificationPromises = admins.map(async (admin) => {
                        console.log(`[saveEnquiry] Creating notification for admin ${admin._id}`);
                        const notification = await Notification.create({
                            receiverId: admin._id,
                            message: `New inquiry from ${name} (${email} - ${phone})`,
                            type: 'contact_inquiry',
                            link: '/admin/dashboard/notifications',
                            metadata: { enquiryId: newEnquiry._id }
                        });
                        
                        console.log(`[saveEnquiry] Emitting to socket room ${admin._id.toString()}`);
                        // Emit real-time event to the admin's socket room
                        io.to(admin._id.toString()).emit('notification', {
                            _id: notification._id,
                            message: notification.message,
                            type: notification.type,
                            link: notification.link,
                            metadata: notification.metadata,
                            read: false,
                            timestamp: notification.timestamp
                        });
                    });

                    await Promise.allSettled(notificationPromises);
                    console.log("[saveEnquiry] All notification promises settled.");
                } catch (socketError) {
                    console.error("Socket error during enquiry notification:", socketError);
                }
            }
            
            return res.status(200).json({ success: true, message: "Enquiry submit successful" })
        }

    } catch (error) {
        console.log(error)
    }

}