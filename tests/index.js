/* Connexion à la base de donnée */
require('../utils/database');

describe("UserService", () => {
    require('./services/UserService.test')
})

describe("UserController", () => {
    require('./controllers/UserController.test')
})