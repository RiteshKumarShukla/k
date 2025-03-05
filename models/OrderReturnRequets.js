const mongoose = require('mongoose');

const ReturnRequestSchema = new mongoose.Schema({
    order: {
        type: Object,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    returnReason: {
        type: String,
        required: true,
    },
    additionalInfo: {
        type: String,
    },
    userID: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    rejectionReason: { type: String },
});

module.exports = mongoose.model('ReturnRequest', ReturnRequestSchema);
