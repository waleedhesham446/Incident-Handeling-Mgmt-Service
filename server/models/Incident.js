const mongoose = require('mongoose');

const IncidentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Not Assigned', 'Assigned', 'Acknowledged', 'Resolved'],
        default: 'Not Assigned',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    updated: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String,
        required: false,
    },
});

const Incident = mongoose.model('Incident', IncidentSchema);

module.exports = Incident;