import LeadModel from "../Models/LeadModel.js";



export const getLeads = async (req, res) => {
    try {
        const {
            search = "",
            status,
            source,
            sortBy = "createdAt",
            sortOrder = "desc",
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Number(page)
        const pageSize = Number(limit)

        const skip = (pageNumber - 1) * pageSize

        const searchQuery = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { company: { $regex: search, $options: "i" } }
                ]
            }
            : {}

        const filterQuery = {
            ...(status && { status: status }), // changed here
            ...(source && { source: source }), // changed here
        }

        const finalQuery = {
            ...searchQuery,
            ...filterQuery,
        }

        const sortQuery = {
            [sortBy]: sortOrder === "asc" ? 1 : -1
        }

        // Add explain() to check query execution plan
        const explainResult = await LeadModel.find(finalQuery).explain("executionStats")
        
        console.log("=== Query Execution Stats ===")
        console.log("Total Docs Examined:", explainResult.executionStats.totalDocsExamined)
        console.log("Total Docs Returned:", explainResult.executionStats.totalDocsReturned)
        console.log("Execution Time (ms):", explainResult.executionStats.executionTimeMillis)
        console.log("Index Used:", explainResult.executionStats.executionStages?.indexName || "COLLSCAN (Full Collection Scan)")
       // console.log("Query Plan:", JSON.stringify(explainResult.executionStats.executionStages, null, 2))

        const leads = await LeadModel.find(finalQuery)
            .sort(sortQuery)
            .skip(skip)
            .limit(pageSize)

        const totalLeads = await LeadModel.countDocuments(finalQuery)

        res.status(200).json({
            success: true,
            message: "Leads fetched successfully",
            data: leads,
            pagination: {
                total: totalLeads,
                page: pageNumber,
                pages: Math.ceil(totalLeads / pageSize),
            },
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error while fetching leads", error: error.message })
    }
}



export const getLeadById = async (req, res) => {
    try {
        const lead = await LeadModel.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Lead fetched successfully",
            data: lead,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch lead",
            error: error.message,
        });
    }
};


export const getLeadAnalytics = async (req, res) => {
    try {
        const totalLeads = await LeadModel.countDocuments()
        const convertedLeads = await LeadModel.countDocuments({ status: "Converted" })

        const leadsByStatus = await LeadModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalLeads,
                convertedLeads,
                leadsByStatus,
            },
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Error while fetching leads", error: error.message })
    }
}