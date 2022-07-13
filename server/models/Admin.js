const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;