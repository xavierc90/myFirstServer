const mongoose = require('mongoose')
const Logger = require('./logger').pino

mongoose.connection.on('connected', () => Logger.info('Connecté à la base de donnée'));
mongoose.connection.on('open', () => Logger.info('Connexion ouverte à la base de données'));
mongoose.connection.on('disconnected', () => Logger.error('Déconnecté de la base de données'));
mongoose.connection.on('reconnected', () => Logger.info('Reconnecté à la base de données'));
mongoose.connection.on('disconnecting', () => Logger.error('Déconnexion de la base de données'));
mongoose.connection.on('close', () => Logger.info('Connexion à la base de données fermée'));




mongoose.connect("mongodb://localhost:27017/CDA_SERVER_TRAINING")