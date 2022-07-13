const express = require('express');
const {
    ackIncident,
    resolveIncident,
    signup,
    signin,
    verifyAccount,
    getAllUsers,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verify/:userId', verifyAccount);
router.get('/all', getAllUsers);
router.put('/acknowledge/:incidentId', auth, ackIncident);
router.put('/resolve/:incidentId', auth, resolveIncident);

module.exports = router;