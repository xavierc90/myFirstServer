const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
let should = chai.should();
const _ = require('lodash')

var users = []

chai.use(chaiHttp)


describe("POST - /user", () => {
    it("Ajouter un utilisateur. - S", (done) => {
        chai.request(server).post('/user').send({
            firstName: "luf",
            lastName: "Us",
            username: "dwarfSlayer",
            email: "lutfu.us@gmail.com"
        }).end((err, res) => {
            expect(res).to.have.status(201)
            users.push(res.body)
            done()
        });
    })
    it("Ajouter un utilisateur incorrect. (Sans firstName) - E", (done) => {
        chai.request(server).post('/user').send({
            lastName: 'Us',
            username: 'dwarfSlayr',
            email: 'lutfu.us@gmil.com'
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un username existant) - E", (done) => {
        chai.request(server).post('/user').send({
            firstName: "luf",
            lastName: "Us",
            username: "dwarfSlayer",
            email: "lutfu.us@gmai.com"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un utilisateur incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/user').send({
            firstName: "luffu",
            lastName: "",
            username: "dwarfSlaye",
            email: "lufu.us@gmai.com"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("POST - /users", () => {
    it("Ajouter plusieurs utilisateurs. - S", (done) => {
        chai.request(server).post('/users').send([{
            firstName: "luf",
            lastName: "Us",
            username: "dwathttvrfSlayer",
            email: "lutfgfbu.us@gmail.com"
        },

        {
            firstName: "luf",
            lastName: "Us",
            username: "dwgfbarfSlayer",
            email: "lutgbffu.us@gmail.com"
        }]
        ).end((err, res) => {
            res.should.have.status(201)

            users = [...users, ...res.body]
            done()
        });
    })
})

describe("GET - /user", () => {
    it("Chercher un utilisateur par un champs sélectionné - S", (done) => {
        chai.request(server).get('/user/').query({fields: ["username"], value: users[0].username})
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Chercher un utilisateur par un champs non autorisé - E", (done) => {
        chai.request(server).get('/user/').query({fields: ["firstName"], value: users[0].username})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Chercher un utilisateur sans aucune query - E", (done) => {
        chai.request(server).get('/user')
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Chercher un utilisateur inexistant - E", (done) => {
        chai.request(server).get('/user').query({fields: ["username"], value: "unknown"})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })  
})

describe("GET - /user", () => {
    it("Chercher un utilisateur correct. - S", (done) => {
        chai.request(server).get('/user/' + users[0]._id)
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Chercher un utilisateur incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/user/665f18739d3e172be5daf092')
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher un utilisateur incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).get('/user/123')
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    
})

describe("GET - /users", () => {
    it("Chercher plusieurs utilisateurs. - S", (done) => {
        chai.request(server).get('/users').query({id: _.map(users, '_id')})
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body).to.be.an('array')
            done()
        })
    })

    it("Chercher plusieurs utilisateurs incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/users').query({id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"]})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).get('/users').query({id: ['123', '456']})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /user", () => {
    it("Modifier un utilisateur. - S", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ firstName: "Olivier" })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Modifier un utilisateur avec un id invalide. - E", (done) => {
        chai.request(server).put('/user/123456789').send({firstName: "Olivier", lastName: "Edouard"})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un utilisateur avec un id inexistant. - E", (done) => {
        chai.request(server).put('/user/66791a552b38d88d8c6e9ee7').send({firstName: "Olivier", lastName: "Edouard"})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier un utilisateur avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ firstName: "", lastName: "Edouard" })
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un utilisateur avec un champ unique existant. - E", (done) => {
        chai.request(server).put('/user/' + users[0]._id).send({ username: users[1].username})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

})

describe("PUT - /users", () => {
    it("Modifier plusieurs utilisateurs. - S", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ firstName: "lucas" })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Modifier plusieurs utilisateurs avec des ids invalide. - E", (done) => {
        chai.request(server).put('/users').query({id: ['267428142', '41452828']}).send({firstName: "Olivier"})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier plusieurs utilisateurs avec des ids inexistant. - E", (done) => {
        chai.request(server).put('/users').query({id: ['66791a552b38d88d8c6e9ee7', '667980886db560087464d3a7']})
        .send({firstName: "Olivier"})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier des utilisateurs avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ firstName: ""})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier des utilisateurs avec un champ unique existant. - E", (done) => {
        chai.request(server).put('/users').query({id: _.map(users, '_id')}).send({ username: users[1].username})
        .end((err, res) => {
            console.log(err)
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /user", () => {
    it("Supprimer un utilisateur. - S", (done) => {
        chai.request(server).delete('/user/' + users[0]._id)
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer un utilisateur incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/user/665f18739d3e172be5daf092')
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer un utilisateur incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/user/123')
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /users", () => {
    it("Supprimer plusieurs utilisateurs. - S", (done) => {
        chai.request(server).delete('/users').query({id: _.map(users, '_id')})
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer plusieurs utilisateurs incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/users/665f18739d3e172be5daf092&665f18739d3e172be5daf093')
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer plusieurs utilisateurs incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/users').query({id: ['123', '456']})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})









//-----------------------------------------------------------------------------------
/* describe("DELETE - /users", () => {
    it ("Supprimer plusieurs utilisateurs existants. - S", (done) => {
        chai.request(server).delete('/users').send([{
            firstName: "luf",
            lastName: "Us",
            username: "dwathttvrfSlayer",
            email: "lutfgfbu.us@gmail.com"
        },

        {
            firstName: "luf",
            lastName: "Us",
            username: "dwgfbarfSlayer",
            email: "lutgbffu.us@gmail.com"
        }]).end((err, res) => {
            expect(res).to.have.status(201)
            users.push(res.body)
            done()
        });
    })

    it ("Supprimer plusieurs utilisateurs inexistants. - E", (done) => {        
        chai.request(server).delete('/users').send({
            firstName: "luf",
            lastName: "Us",
            username: "dwarfSlayer",
            email: "lutfu.us@gmail.com"
        }).end((err, res) => {
            expect(res).to.have.status(405)
            users.push(res.body)
            done()
        });
    
    })
}) */