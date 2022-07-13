const express = require('express');
const {
    login,
    addAdmin,
    raiseIncident,
    assignIncident,
    deleteIncident
} = require('../controllers/admin');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/login', login);
router.post('/addAdmin', auth, addAdmin);
router.post('/incident/raise', auth, raiseIncident);
router.put('/incident/assign/:incidentId', auth, assignIncident);
router.delete('/incident/delete/:incidentId', auth, deleteIncident);

module.exports = router;