const LoggerHttp = require('../utils/logger').http

module.exports.addLogger = function (req, res, next) {
    LoggerHttp(req, res)
    next()
}