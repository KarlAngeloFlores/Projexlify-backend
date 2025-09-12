const clc = require("cli-color");

/**
 * @param {String} message 
 */
const logInfo = (message) => {
    console.log(clc.blue('INFO:'), message);
}

/**
 * @param {String} message
 */

const logSuccess = (message) => {
    console.log(clc.green('SUCCESS:'), message)
}

/**
 * @param {String} message
 */

const logError = (message) => {
    console.log(clc.red('ERROR:'), message)
}

/**
 * @param {String} message
 */

const logSuccessMiddleware = (message) => {
    console.log(clc.bgMagenta.blackBright('PASSED MIDDLEWARE:', message))
}

module.exports = {
    logInfo,
    logSuccess,
    logError,
    logSuccessMiddleware
}