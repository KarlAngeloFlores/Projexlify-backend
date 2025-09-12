const clc = require('cli-color');
const jwt = require('jsonwebtoken');
const { logInfo, logSuccess, logSuccessMiddleware } = require('../utils/logs.util');

//access token is required for this middleware to get userId
const auth = (req, res, next) => {
    try {
        //get access token from cookies
        const accessToken = req.cookies?.accessToken;

        if(!accessToken) {
            return res.status(401).json({message: 'No access token'});
        };

        //verify token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET); 
        req.user = decoded;
        logSuccessMiddleware('AUTH')
        next();

    } catch (error) {
        console.log(clc.red('Error:', error.message));
        return res.status(403).json({
            message: 'Invalid or expired token'
        });
    }
}

module.exports = auth;