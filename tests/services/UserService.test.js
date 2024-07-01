const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_user_valid = ""
var tab_id_users = []
var users = []

describe("addOneUser", () => {
    it("Utilisateur correct. - S", () => {
        var user = {
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupont1@gmail.com",
            username: "edupont1"
        }
        UserService.addOneUser(user, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            id_user_valid = value._id
            users.push(value)
            //console.log(value)
        })
    })
    it("Utilisateur incorrect. (Sans firstName) - E", () => {
        var user_no_valid = {
            lastName: "Dupont",
            email: "edouard.dupont2@gmail.com",
            username: "edupont2"
        }
        UserService.addOneUser(user_no_valid, function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('firstName')
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')

        })
    })
})

describe("addManyUsers", () => {
    it("Utilisateurs à ajouter, non valide. - E", (done) => {
        var users_tab_error = [{
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupont3@gmail.com",
            username: "edupont3"
        }, {
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupont4@gmail.com",
            username: "",
            testing: true,
            phone: "0645102340"
        },
        {
            firstName: "Edouard",
            lastName: "Dupont",
            email: "edouard.dupon5t@gmail.com",
            username: "edupont4",
            testing: true,
            phone: "0645102340"
        }, {
            firstName: "Edouard",
            email: "edouard.dupont6@gmail.com"
        }]

        UserService.addManyUsers(users_tab_error, function (err, value) {
            done()
        })
    })
    it("Utilisateurs à ajouter, valide. - S", (done) => {
        var users_tab = [{
            firstName: "Louison",
            lastName: "Dupont",
            email: "edouard.dupont7@gmail.com",
            username: "edupont5"
        }, {
            firstName: "Jordan",
            lastName: "Dupont",
            email: "edouard.dupont8@gmail.com",
            username: "La",
            testing: true,
            phone: "0645102340"
        },
        {
            firstName: "Mathis",
            lastName: "Dupont",
            email: "edouard.dupont9@gmail.com",
            username: "edupont6",
            testing: true,
            phone: "0645102340"
        }]

        UserService.addManyUsers(users_tab, function (err, value) {
            tab_id_users = _.map(value, '_id')
            users = [... value, ...users]
            expect(value).lengthOf(3)
            done()
        })
    })
})

describe("findOneUser", () => {
    it("Chercher un utilisateur par les champs sélectionnés - S", (done) => {
        UserService.findOneUser(["email", "username"], users[0].username, function (err, value) {
            expect(value).to.haveOwnProperty('firstName')
            done()
        })
    })
    it("Chercher un utilisateur avec un champs non autorisé - E", (done) => {
        UserService.findOneUser(["email", "firstName"], users[0].username, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher un utilisateur sans tableau de champs - E", (done) => {
        UserService.findOneUser("email", users[0].username, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher un utilisateur inexistant - E", (done) => {
        UserService.findOneUser(["email"], "users[0].username", function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})


describe("findOneUserById", () => {
    it("Chercher un utilisateur existant correct. - S", (done) => {
        UserService.findOneUserById(id_user_valid, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('lastName')
            done()

        })
    })
    it("Chercher un utilisateur non-existant correct. - E", (done) => {
        UserService.findOneUserById("100", function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyUsersById", () => {
    it("Chercher des utilisateurs existant correct. - S", (done) => {
        UserService.findManyUsersById(tab_id_users, function (err, value) {
            expect(value).lengthOf(3)
            done()

        })
    })
})

describe("updateOneUser", () => {
    it("Modifier un utilisateur correct. - S", (done) => {
        UserService.updateOneUser(id_user_valid, { firstName: "Jean", lastName: "Luc" }, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('firstName')
            expect(value).to.haveOwnProperty('lastName')
            expect(value['firstName']).to.be.equal('Jean')
            expect(value['lastName']).to.be.equal('Luc')
            done()

        })
    })
    it("Modifier un utilisateur avec id incorrect. - E", (done) => {
        UserService.updateOneUser("1200", { firstName: "Jean", lastName: "Luc" }, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un utilisateur avec des champs requis vide. - E", (done) => {
        UserService.updateOneUser(id_user_valid, { firstName: "", lastName: "Luc" }, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('firstName')
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')
            done()
        })
    })
})

describe("updateManyUsers", () => {
    it("Modifier plusieurs utilisateurs correctement. - S", (done) => {
        UserService.updateManyUsers(tab_id_users, { firstName: "Jean", lastName: "Luc" }, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_users.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_users.length)
            done()

        })
    })
    it("Modifier plusieurs utilisateurs avec id incorrect. - E", (done) => {
        UserService.updateManyUsers("1200", { firstName: "Jean", lastName: "Luc" }, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs utilisateurs avec des champs requis vide. - E", (done) => {
        UserService.updateManyUsers(tab_id_users, { firstName: "", lastName: "Luc" }, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('firstName')
            expect(err['fields']['firstName']).to.equal('Path `firstName` is required.')
            done()
        })
    })
})

describe("deleteOneUser", () => {
    it("Supprimer un utilisateur correct. - S", (done) => {
        UserService.deleteOneUser(id_user_valid, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('firstName')
            expect(value).to.haveOwnProperty('lastName')
            done()

        })
    })
    it("Supprimer un utilisateur avec id incorrect. - E", (done) => {
        UserService.deleteOneUser("1200", function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un utilisateur avec un id inexistant. - E", (done) => {
        UserService.deleteOneUser("665f00c6f64f76ba59361e9f", function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyUsers", () => {
    it("Supprimer plusieurs utilisateurs correctement. - S", (done) => {
        UserService.deleteManyUsers(tab_id_users, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_users.length)
            done()

        })
    })
    it("Supprimer plusieurs utilisateurs avec id incorrect. - E", (done) => {
        UserService.deleteManyUsers("1200", function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })

})



/* describe("UserService", () => {
    describe("addOneUser", () => {
        it("Utilisateur valide. - S", () => {
            var user_valid = {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont"
            }
            UserService.addOneUser(user_valid, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('id')
            })
        })
        it("Sans nom d'utilisateur. - E", () => {
            var user_without_username = {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com"
            }
            UserService.addOneUser(user_without_username, function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('key_required_not_include').with.lengthOf(1)

            })
        })

        it("Avec un champs en trop. - S", () => {
            var user_with_not_authorized_key = {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont",
                testing: true,
                phone: "0645102340"
            }
            UserService.addOneUser(user_with_not_authorized_key, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('id')
                expect(value).not.haveOwnProperty('testing')
            })
        })

        it("Avec un champs requis vide. - E", () => {
            var user_with_not_authorized_key = {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "",
                testing: true,
                phone: "0645102340"
            }
            UserService.addOneUser(user_with_not_authorized_key, function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('key_required_empty').with.lengthOf(1)

            })
        })

    })
    describe("updateOneUser", () => {
        it("Modification d'un utilisateur correct. - S", () => {
            UserService.updateOneUser('1', { lastName: "Maurice" }, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('id')
                expect(value).to.haveOwnProperty('lastName')
                expect(value.lastName).to.equal("Maurice")
            })
        })
        it("Modification d'un utilisateur avec un champs requis, vide. - E", () => {
            UserService.updateOneUser('1', { lastName: "" }, function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('key_required_empty').with.lengthOf(1, "Le tableau n'a pas retourne le nombre correcte d'element empty.")
            })
        })
        it("Modification d'un utilisateur avec un id invalide. - E", () => {
            UserService.updateOneUser('100', { lastName: "Edouard" }, function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('key_required_empty').with.lengthOf(0)
                expect(err).to.haveOwnProperty('key_required_not_include').with.lengthOf(0)

            })
        })
    })
    describe("addManyUsers", () => {
        it("Ajout de plusieurs utilisateurs non correcte. - E", () => {

            var users_tab_error = [{
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont"
            }, {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "",
                testing: true,
                phone: "0645102340"
            },
            {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont",
                testing: true,
                phone: "0645102340"
            }, {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com"
            }]
            UserService.addManyUsers(users_tab_error, function (err, value) {
                expect(err).to.have.lengthOf(2);
                expect(err[0]).to.haveOwnProperty('msg')
                expect(err[0]).to.haveOwnProperty('key_required_empty').with.lengthOf(1)
                expect(err[1]).to.haveOwnProperty('msg')
                expect(err[1]).to.haveOwnProperty('key_required_empty').with.lengthOf(0)
                expect(err[1]).to.haveOwnProperty('key_required_not_include').with.lengthOf(1)

            })
        })
        it("Ajout de plusieurs utilisateurs tous correct. - S", () => {
            var users_tab_error = [{
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont"
            }, {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "La",
                testing: true,
                phone: "0645102340"
            },
            {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont",
                testing: true,
                phone: "0645102340"
            }]
            UserService.addManyUsers(users_tab_error, function (err, value) {
                expect(value).to.have.lengthOf(users_tab_error.length);
                value.forEach((e) => {
                    expect(e).to.be.a('object');
                    expect(e).to.haveOwnProperty('id')
                    expect(e).to.haveOwnProperty('lastName')

                })
            })
        })
    })
    describe("findOneUserById", () => {
        it("Chercher un utilisateur existant correct. - S", () => {

            UserService.findOneUserById("1", function (err, value) {
                expect(value).to.be.a('object');
                //console.log(err)
                expect(value).to.haveOwnProperty('id')
                expect(value).to.haveOwnProperty('lastName')
                expect(value['id']).to.equal('1')
            })
        })
        it("Chercher un utilisateur non-existant correct. - E", () => {

            UserService.findOneUserById("100", function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('error_type')
                expect(err["error_type"]).to.equal('Not-Found')
            })
        })

    })
    describe("findManyUsersById", () => {
        it("Chercher plusieurs utilisateurs existants. - S", () => {
            var tabIds = ["1", "2"]
            UserService.findManyUsersById(tabIds, function (err, value) {
                expect(value).to.have.lengthOf(tabIds.length);
                value.forEach((e) => {
                    expect(e).to.be.a('object');
                    expect(e).to.haveOwnProperty('id')
                    expect(e).to.haveOwnProperty('lastName')
                })
            })
        })
        it("Chercher plusieurs utilisateurs qui n'existent pas. - S", () => {
            var tabIds = ["100", "200"]
            UserService.findManyUsersById(tabIds, function (err, value) {
                expect(value).to.have.lengthOf(0);
            })
        })
    })
    describe("deleteOneUser", () => {
        it("Supprimer un utilisateur qui existe. - S", () => {
            UserService.deleteOneUser("1", function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('msg')
                expect(value).to.haveOwnProperty('user_delete')
                expect(value['user_delete']).to.haveOwnProperty('id')
                expect(value['user_delete']['id']).to.be.equal('1')
            })
        })
        it("Supprimer un utilisateur qui n'existe pas. - E", () => {
            UserService.deleteOneUser("100", function (err, value) {
                expect(err).to.be.a('object');
                expect(err).to.haveOwnProperty('msg')
            })
        })
    })
    describe("deleteManyUsers", () => {
        it("Supprimer plusieurs utilisateurs tous find. - S", () => {
            var idTab = ["2"]
            UserService.deleteManyUsers(idTab, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('msg')
                expect(value).to.haveOwnProperty('count_remove')
                expect(value['count_remove']).to.equal(idTab.length)
            })
        })
        it("Supprimer plusieurs utilisateurs pas tous find. - S", () => {
            var idTab = ["2", "3"]
            UserService.deleteManyUsers(idTab, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('msg')
                expect(value).to.haveOwnProperty('count_remove')
                expect(value['count_remove']).to.equal(idTab.length-1)
            })
        })
    })
}) */