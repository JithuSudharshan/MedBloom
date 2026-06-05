import Doctor from "../../../model/doctorModel.js"
import Department from "../../../model/departmentModel.js"
export const fetchDoctorData = async (req, res) => {
    try {
        const {
            search,
            speciality,
            mode,
            minFee,
            maxFee,
            sortBy,
            page = 1,
            limit = 10
        } = req.query;

        // 1. Build Query Object
        const query = { status: 'approved' };

        // Search by name or location
        if (search) {
            query.$or = [
                { displayName: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { clinicAddress: { $regex: search, $options: 'i' } }
            ];
        }

        // Exact match Speciality
        if (speciality && speciality !== 'All') {
            query.primarySpecialization = speciality;
        }

        // Mode filter
        if (mode && mode !== 'both') {
            query.consultationMode = { $in: [mode, 'both'] };
        }

        // Fee Range (Check both online and offline based on mode)
        if (minFee || maxFee) {
            const min = minFee ? Number(minFee) : 0;
            const max = maxFee ? Number(maxFee) : Infinity;

            const feeConditions = [];
            if (!mode || mode === 'online' || mode === 'both') {
                feeConditions.push({ 'consultationFees.online': { $gte: min, $lte: max } });
            }
            if (!mode || mode === 'offline' || mode === 'both') {
                feeConditions.push({ 'consultationFees.offline': { $gte: min, $lte: max } });
            }

            if (feeConditions.length > 0) {
                // If there's an existing $or from search, we must use $and
                if (query.$or) {
                    query.$and = [{ $or: query.$or }, { $or: feeConditions }];
                    delete query.$or;
                } else {
                    query.$or = feeConditions;
                }
            }
        }

        // 2. Build Sort Object
        let sortOptions = {};
        if (sortBy === 'rating') {
            sortOptions.rating = -1; // Highest first
        } else if (sortBy === 'experience') {
            sortOptions.yearOfExperience = -1; // Highest first
        } else {
            sortOptions.createdAt = -1; // Default
        }

        // 3. Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const data = await Doctor.find(query)
            .select('profilePicture displayName yearOfExperience primarySpecialization consultationMode rating totalReviews consultationFees location')
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalCount = await Doctor.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limitNum);

        res.status(200).json({
            success: true,
            message: "data fetched succesfully",
            data: {
                doctors: data,
                page: pageNum,
                totalPages,
                totalCount
            }
        });

    } catch (error) {
        console.log("Error while fetcing data for landing page ", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const fetchActiveDepartments = async (req, res) => {
    try {
        const departments = await Department.find({ status: 'active' }).select('departmentName');

        if (!departments) {
            return res.status(400).json({ success: false, message: "Failed to fetch departments" });
        }

        res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            data: departments
        });

    } catch (error) {
        console.log("Error while fetching departments ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}