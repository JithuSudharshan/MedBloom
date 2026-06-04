import fs from 'fs';
const file = '/home/asus/Documents/Brocamp/MEDBLOOM/backend/src/controller/userControllers/DoctorDashboard/doctorProfileControllers.js';
let content = fs.readFileSync(file, 'utf8');

const newFunc = `
export const fetchDoctorPatients = async (req, res) => {
    try {
        const userId = req.user._id;
        const doctor = await Doctor.findOne({ user: userId });
        
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        // Aggregate unique patients from appointments
        const pipeline = [
            { $match: { doctor: doctor._id } },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: "$patient",
                    totalVisits: { $sum: 1 },
                    lastVisit: { $first: "$date" }
                }
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "_id",
                    foreignField: "_id",
                    as: "patientData"
                }
            },
            { $unwind: "$patientData" },
            {
                $lookup: {
                    from: "users",
                    localField: "patientData.user",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            { $unwind: "$userData" }
        ];

        // Add search match if provided
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "userData.name": { $regex: search, $options: 'i' } },
                        { "userData.email": { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        // Count for pagination
        const countPipeline = [...pipeline, { $count: "total" }];
        const countResult = await Appointment.aggregate(countPipeline);
        const totalNoOfPatients = countResult.length > 0 ? countResult[0].total : 0;
        const totalPages = Math.ceil(totalNoOfPatients / limit);

        // Add pagination
        pipeline.push({ $skip: (page - 1) * limit });
        pipeline.push({ $limit: limit });

        const uniquePatients = await Appointment.aggregate(pipeline);

        const formattedPatients = uniquePatients.map(p => ({
            id: p._id,
            name: p.userData.name,
            email: p.userData.email,
            profileUrl: p.userData.profile_url,
            gender: p.patientData.gender,
            bloodGroup: p.patientData.bloodGroup,
            totalVisits: p.totalVisits,
            lastVisit: p.lastVisit
        }));

        res.status(200).json({
            success: true,
            data: {
                patients: formattedPatients,
                page,
                totalPages,
                totalNoOfPatients
            }
        });
    } catch (error) {
        console.error("Error fetching doctor patients:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
`;

if (!content.includes('fetchDoctorPatients')) {
    fs.writeFileSync(file, content + '\n' + newFunc);
}
