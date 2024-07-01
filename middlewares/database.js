const mongoose = require ('mongoose')

module.exports.checkConnexion = function(req,res,next) {
    if (mongoose.connection.readyState == 1) {
        req.log.info("Verification de la connection base de donnée : OK")
    next()
    }
    else {
        req.log.info("Verification de la connection base de donnée : NOK")
        res.statusCode = 500
        res.send({msg: `La base de donnée est en erreur ${mongoose.connection.readyState}`, type_error: "error-connexion-db"})
    }
}