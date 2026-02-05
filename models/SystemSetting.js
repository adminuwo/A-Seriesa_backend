import mongoose from "mongoose";

const systemSettingSchema = mongoose.Schema({
    platformName: {
        type: String,
        default: 'A-Series™'
    },
    contactEmail: {
        type: String,
        default: 'support@a-series.in'
    },
    supportPhone: {
        type: String,
        default: '+91 83598 90909'
    },
    announcement: {
        type: String,
        default: ''
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    killSwitch: {
        type: Boolean,
        default: false
    },
    allowPublicSignup: {
        type: Boolean,
        default: true
    },
    defaultModel: {
        type: String,
        default: 'gemini-2.5-flash'
    },
    maxTokensPerUser: {
        type: Number,
        default: 1000000
    }
}, { timestamps: true });

export default mongoose.model("SystemSetting", systemSettingSchema);
