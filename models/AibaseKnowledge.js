import mongoose from 'mongoose';

const AibaseKnowledgeSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        default: 'admin'
    }
}, { timestamps: true });

export default mongoose.model('AibaseKnowledge', AibaseKnowledgeSchema);
