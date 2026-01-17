import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            index: true,
        },

        phone: {
            type: String,
            index: true,
        },

        company: {
            type: String,
            index: true,
        },

        source: {
            type: String,
            enum: ["Website", "Facebook", "Referral", "LinkedIn", "Other"],
            default: "Other",
            index: true,
        },

        status: {
            type: String,
            enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
            default: "New",
            index: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Additional indexes
LeadSchema.index({ createdAt: -1 });
export default mongoose.model("Lead", LeadSchema);
