const Incident = require('../models/Incident');
const mongoose = require('mongoose');

const getAllIncident = async (req, res) => {
    try {
        let { page, titleFilter, descriptionFilter, usernameFilter, statusFilter, order } = req.query;
        console.log(req.query);
        if(!page) page = 1;
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Incident.countDocuments({});
        let incidents;
        
        if(usernameFilter) incidents = await Incident.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },{
                $project: {
                    "_id": 1,
                    "title": 1,
                    "description": 1,
                    "status": 1,
                    "updated": 1,
                    "username": "$user.username",
                }
            },{
                $match: {
                    title: new RegExp(titleFilter, 'i'),
                    description: new RegExp(descriptionFilter, 'i'),
                    status: new RegExp(statusFilter, 'i'),
                    username: new RegExp(usernameFilter, 'i'),
                }
            }
        ]).sort({ updated: order }).skip(startIndex).limit(LIMIT);
        else incidents = await Incident.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },{
                $project: {
                    "_id": 1,
                    "title": 1,
                    "description": 1,
                    "status": 1,
                    "updated": 1,
                    "username": "$user.username",
                }
            },{
                $match: {
                    title: new RegExp(titleFilter, 'i'),
                    description: new RegExp(descriptionFilter, 'i'),
                    status: new RegExp(statusFilter, 'i'),
                }
            }
        ]).sort({ updated: parseInt(order) }).skip(startIndex).limit(LIMIT);

        console.log(incidents);
        
        res.status(200).json({ incidents, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT), total });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getIncident = async (req, res) => {
    try {
        const { incidentId } = req.params;
        let incident = await Incident.aggregate([{
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $match: {
                _id: new mongoose.Types.ObjectId(incidentId)
            }
        },{
            $project: {
                "_id": 1,
                "title": 1,
                "description": 1,
                "status": 1,
                "comment": 1,
                "userId": 1,
                "username": "$user.username",
            }
        }]);

        res.status(200).json({ incident });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getIncidentsOfUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const incidents = await Incident.find({ userId });

        res.status(200).json({ incidents });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = { 
    getAllIncident,
    getIncident,
    getIncidentsOfUser,
};