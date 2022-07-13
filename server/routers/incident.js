const express = require('express');
const {
    getAllIncident,
    getIncident,
    getIncidentsOfUser,
} = require('../controllers/incident');

const router = express.Router();

router.get('/all', getAllIncident);
router.get('/one/:incidentId', getIncident);
router.get('/user/:userId', getIncidentsOfUser);

module.exports = router;