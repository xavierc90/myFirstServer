const UserService = require('../services/UserService')
const LoggerHttp = require ('../utils/logger').http

// La fonction permet d'ajouter un utilisateur
module.exports.addOneUser = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Création d'un utilisateur")
    UserService.addOneUser(req.body, function(err, value) {
        if (err && err.type_error == "no found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "validator") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "duplicate") {
            res.statusCode = 405
            res.send(err)   
        }
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet d'ajouter plusieurs utilisateurs
module.exports.addManyUsers = function(req, res) {
    req.log.info("Création de plusieurs utilisateurs")
    UserService.addManyUsers(req.body, function(err, value) {
        if (err) {
            res.statusCode = 405
            res.send(err)
        }  
        else {
            res.statusCode = 201
            res.send(value)
        }
    })
}

// La fonction permet de chercher un utilisateur avec les champs "username" et "email" 
module.exports.findOneUser = function(req, res) {
    req.log.info("Recherche d'un utilisateur avec un champs")
    var arg = req.query.fields
    if (arg && !Array.isArray(arg))
        arg = [arg]
    UserService.findOneUser(arg, req.query.value, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    }
)}

// La fonction permet de chercher un utilisateur
module.exports.findOneUserById = function(req, res) {
    req.log.info("Recherche d'un utilisateur")
    UserService.findOneUserById(req.params.id, function(err, value) {        
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de chercher plusieurs utilisateurs
module.exports.findManyUsersById = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Recherche de plusieurs utilisateurs", req.query.id)
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg=[arg]
    UserService.findManyUsersById(arg, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de supprimer un utilisateur
module.exports.deleteOneUser = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression d'un utilisateur")
    UserService.deleteOneUser(req.params.id, function(err, value) {        
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de supprimer plusieurs utilisateurs
module.exports.deleteManyUsers = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Suppression de plusieurs utilisateur")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    UserService.deleteManyUsers(arg, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && err.type_error == "no-valid") {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}


// La fonction permet de modifier un utilisateur
module.exports.updateOneUser = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification d'un utilisateur")
    UserService.updateOneUser(req.params.id, req.body, function(err, value) {
        console.log(err)
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == "duplicate" ) ) {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

// La fonction permet de modifier plusieurs utilisateurs
module.exports.updateManyUsers = function(req, res) {
    LoggerHttp(req, res)
    req.log.info("Modification de plusieurs utilisateurs")
    var arg = req.query.id
    if (arg && !Array.isArray(arg))
        arg = [arg]
    var updateData = req.body
    UserService.updateManyUsers(arg, updateData, function(err, value) {
        if (err && err.type_error == "no-found") {
            res.statusCode = 404
            res.send(err)
        }
        else if (err && (err.type_error == "no-valid" || err.type_error == "validator" || err.type_error == 'duplicate')) {
            res.statusCode = 405
            res.send(err)
        }
        else if (err && err.type_error == "error-mongo") {
            res.statusCode = 500
        }
        else {
            res.statusCode = 200
            res.send(value)
        }
    })
}

