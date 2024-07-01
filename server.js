// 1ere chose à faire, importer les librairies
const express = require('express')              
const _ = require("lodash")
const bodyParser = require('body-parser')
const Config = require ('./config')
const Logger = require('./utils/logger').pino

// Création de notre application express.js
const app = express()

// Démarrage de la database
require('./utils/database')

// Déclaration des controllers pour l'utilisateur
const UserController = require('./controllers/UserController')

// Déclaration des middlewares
const DatabaseMiddleware = require('./middlewares/database')
const LoggerMiddleware = require('./middlewares/logger')

// Déclaration des middlewares à express
app.use(bodyParser.json(), LoggerMiddleware.addLogger)


/*--------------------- Création des routes (User - Utilisateur) ---------------------*/

// Création du endpoint /user pour l'ajout d'un utilisateur
app.post('/user', DatabaseMiddleware.checkConnexion, UserController.addOneUser)

// Création du endpoint /user pour l'ajout de plusieurs utilisateurs
app.post('/users', DatabaseMiddleware.checkConnexion, UserController.addManyUsers)

// Création du endpoint /user pour la récupération d'un utilisateur avec champs
app.get('/user', DatabaseMiddleware.checkConnexion, UserController.findOneUser)

// Création du endpoint /user pour la récupération d'un utilisateur
app.get('/user/:id', DatabaseMiddleware.checkConnexion, UserController.findOneUserById)

// Création du endpoint /users pour la récupération de plusieurs utilisateurs
app.get('/users', DatabaseMiddleware.checkConnexion, UserController.findManyUsersById)

// Création du endpoint /user pour la modification d'un utilisateur
app.put('/user/:id', DatabaseMiddleware.checkConnexion, UserController.updateOneUser)

// Création du endpoint /user pour la modification de plusieurs utilisateurs
app.put('/users', DatabaseMiddleware.checkConnexion, UserController.updateManyUsers)

// Création du endpoint /user pour la suppression d'un utilisateur
app.delete('/user/:id', DatabaseMiddleware.checkConnexion, UserController.deleteOneUser)

// Création du endpoint /user pour la suppression de plusieurs utilisateurs
app.delete('/users', DatabaseMiddleware.checkConnexion, UserController.deleteManyUsers)


// 2e chose à faire : Créer le server avec app.listen
app.listen(Config.port, () => {   
    Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})

module.exports = app