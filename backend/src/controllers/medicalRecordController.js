import { MedicalRecord } from "../model/medicalRecordModel.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUploader.js";
import cloudinary from "../config/cloudinary.js";

// Upload a new medical record
export const uploadRecord = async (req, res) => {
    try {
        const patientId = req.user._id;
        const { title, category, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file provided" });
        }
        if (!title || !category) {
            return res.status(400).json({ success: false, message: "Title and category are required" });
        }

        // Determine resource type: "raw" for PDFs, "auto" for images
        const isPdf = req.file.mimetype === 'application/pdf';
        const resourceType = isPdf ? 'raw' : 'auto';

        // Upload to Cloudinary
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "medbloom/medical_records", resourceType);

        const newRecord = new MedicalRecord({
            patientId,
            title,
            category,
            description,
            fileUrl: uploadResult.secure_url,
            fileType: isPdf ? 'pdf' : (uploadResult.format || req.file.mimetype.split('/')[1] || "unknown"),
            fileSize: uploadResult.bytes || req.file.size
        });

        await newRecord.save();

        res.status(201).json({ success: true, message: "Record uploaded successfully", record: newRecord });
    } catch (error) {
        console.error("Upload Record Error:", error);
        res.status(500).json({ success: false, message: "Server error during upload" });
    }
};

// Fetch all medical records for the authenticated patient
export const getRecords = async (req, res) => {
    try {
        const patientId = req.user._id;
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "5", 10);
        const skip = (page - 1) * limit;
        const { search, category } = req.query;

        let query = { patientId };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const totalCount = await MedicalRecord.countDocuments(query);
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));

        const records = await MedicalRecord.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

        res.status(200).json({ success: true, records, page, totalPages, totalCount });
    } catch (error) {
        console.error("Get Records Error:", error);
        res.status(500).json({ success: false, message: "Server error fetching records" });
    }
};

// Update record metadata
export const updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description } = req.body;

        const record = await MedicalRecord.findOneAndUpdate(
            { _id: id, patientId: req.user._id },
            { title, category, description },
            { new: true }
        );

        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        res.status(200).json({ success: true, message: "Record updated successfully", record });
    } catch (error) {
        console.error("Update Record Error:", error);
        res.status(500).json({ success: false, message: "Server error updating record" });
    }
};

// Delete record
export const deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await MedicalRecord.findOne({ _id: id, patientId: req.user._id });
        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }

        // Extract public_id from Cloudinary URL to delete it from storage
        // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/medbloom/medical_records/file_name.pdf
        const urlParts = record.fileUrl.split('/');
        const versionIndex = urlParts.findIndex(part => part.startsWith('v') && !isNaN(part.substring(1)));
        
        if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
            // Join the rest of the path after the version folder, and strip the extension
            let publicId = urlParts.slice(versionIndex + 1).join('/');
            publicId = publicId.substring(0, publicId.lastIndexOf('.'));
            
            if (publicId) {
                try {
                    // Resource type might be raw (PDF) or image
                    const resourceType = record.fileType === 'pdf' ? 'raw' : 'image';
                    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
                } catch (cloudinaryErr) {
                    console.error("Failed to delete from Cloudinary:", cloudinaryErr);
                    // Continue with DB deletion even if Cloudinary fails
                }
            }
        }

        await MedicalRecord.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
        console.error("Delete Record Error:", error);
        res.status(500).json({ success: false, message: "Server error deleting record" });
    }
};
