const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.body.userid = decoded.userid;
        req.body.isAdmin = decoded.isAdmin;
        
		next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};