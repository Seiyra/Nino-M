import mongoose from 'mongoose';

const warningSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    groupId: { type: String, required: true }, // add this field
    count: { type: Number, default: 0 },
    timestamps: { type: Date, default: Date.now }
});
const Warning = mongoose.model('Warning', warningSchema);

export default Warning;
