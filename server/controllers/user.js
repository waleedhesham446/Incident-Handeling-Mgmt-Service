const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Incident = require('../models/Incident');

require('dotenv').config();

const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const existingUserName = await User.findOne({ username });
        if(existingUserName) return res.status(406).json({ message: 'username already exists' });
        
        const existingEmail = await User.findOne({ email });
        if(existingEmail) return res.status(411).json({ message: 'email already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({ email, password: hashedPassword, username });

        res.status(200).json({ message: 'You signed up successfully, Go login' });
    } catch (error) {
        res.status(500).json(error);
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(406).json({ message: 'Invalid email or password' });

        // if(!existingUser.verified) return res.status(406).json({ message: 'This email is not verified yet' });
        
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) return res.status(401).json({ message: 'Invalid email or password' });

        existingUser = existingUser.toObject();
        delete existingUser.password;
        
        const token = jwt.sign({ 
            userid: existingUser._id,
            isAdmin: false,
        }, process.env.JWT_PRIVATE_KEY, { expiresIn: "365d" });

        res.status(200).json({ user: existingUser, token, isAdmin: false });
    } catch (error) {
        res.status(500).json(error);
    }
}

const verifyAccount = async (req, res) => {
    try {
        const { userId } = req.params;
        
        await User.findByIdAndUpdate(userId, { verified: true }, { new: true });

        return res.send('Your account has been activated successfully, go sign in');
    } catch (error) {
        res.status(500).json({ error });
    }
}

const ackIncident = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const { userid } = req.body;
        
        const incident = await Incident.findOneAndUpdate({ _id: incidentId, userId: userid }, { status: 'Acknowledged', updated: Date.now(), }, { new: true });

        if(!incident) return res.status(403).json({ message: 'This incident is not assigned to you or does not exist' });

        return res.status(200).json({ message: 'You have acknowledged the incident successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const resolveIncident = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const { userid, comment } = req.body;

        const oldIncident = await Incident.findById(incidentId);
        if(!oldIncident || oldIncident.userId != userid) return res.status(403).json({ message: 'This incident is not assigned to you or does not exist' });
        
        if(oldIncident.status != 'Acknowledged') return res.status(406).json({ message: 'You must acknowledge the incident first' });
        
        await Incident.findByIdAndUpdate(incidentId, { status: 'Resolved', comment, updated: Date.now(), }, { new: true });

        return res.status(200).json({ message: 'You have resolved the incident successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select({ "username": 1, "_id": 1 });

        return res.send({ users });
    } catch (error) {
        res.status(500).json({ error });
    }
}

module.exports = {
    signup,
    signin,
    verifyAccount,
    ackIncident,
    resolveIncident,
    getAllUsers,
}