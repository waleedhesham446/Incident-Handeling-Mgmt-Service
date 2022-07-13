const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Incident = require('../models/Incident');
const User = require('../models/User');

require('dotenv').config();

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        let existingAdmin = await Admin.findOne({ username });
        if(!existingAdmin) return res.status(401).json({ message: 'Invalid username or password' });
        
        const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
        if(!isPasswordCorrect) return res.status(401).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ 
            userid: existingAdmin._id,
            isAdmin: true,
        }, process.env.JWT_PRIVATE_KEY, { expiresIn: "365d" });

        res.status(200).json({ token, isAdmin: true, user: existingAdmin });
    } catch (error) {
        res.status(500).json(error);
    }
}

const addAdmin = async (req, res) => {
    try {
        const { username, password, isAdmin } = req.body;
        
        if(!username || !password || username.length < 5 || password.length < 5) return res.status(403).json({ message: 'Invalid username or password' });

        if(!isAdmin) return res.status(403).json({ message: 'You are not authorized to add admins' });
        
        let existingAdmin = await Admin.findOne({ username });
        if(existingAdmin) return res.status(406).json({ message: 'This username already exists' });
        
        const hashedPassword = await bcrypt.hash(password, 12);

        await Admin.create({ password: hashedPassword, username });

        res.status(200).json({ message: 'The new admin has been created successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
}

const raiseIncident = async (req, res) => {
    try {
        const { isAdmin, title, description } = req.body;
        console.log(req.body);
        if(!isAdmin) return res.status(403).json({ message: 'You are not authorized to raise an incident' });
        
        const newIncident = await Incident.create({ title, description });

        res.status(200).json({ message: 'The new incident has been created successfully', newIncident });
    } catch (error) {
        res.status(500).json(error);
    }
}

const assignIncident = async (req, res) => {
    try {
        const { isAdmin, userId } = req.body;
        const { incidentId } = req.params;
        if(!isAdmin) return res.status(403).json({ message: 'You are not authorized to assign an incident' });
        
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({ message: 'This user does not exist' });

        const updatedIncident = await Incident.findOneAndUpdate({ 
            _id: incidentId, 
            $or: [ { status: 'Not Assigned' }, { status: 'Assigned' } ] 
        }, {
            userId,
            status: 'Assigned',
            updated: Date.now(),
        }, {
            new: true,
        });

        if(!updatedIncident) return res.status(403).json({ message: 'This incident is not available' });

        res.status(200).json({ message: 'The Incident has been assigned successfully', updatedIncident });
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteIncident = async (req, res) => {
    try {
        const { isAdmin } = req.body;
        const { incidentId } = req.params;
        if(!isAdmin) return res.status(403).json({ message: 'You are not authorized to delete an incident' });

        const deletedIncident = await Incident.findByIdAndDelete(incidentId);

        if(!deletedIncident) return res.status(404).json({ message: 'This incident does not exist' });

        res.status(200).json({ message: 'The Incident has been deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    login,
    addAdmin,
    raiseIncident,
    assignIncident,
    deleteIncident
}