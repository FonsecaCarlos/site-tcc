const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const env = require('../src/.env')
require('../src/loader')

chai.use(chaiHttp)

const assert = require('assert')

const BASE_OPEN_URL = env.OAPI

const NOW = Date.now()
const USER = {
    name: 'Teste da Silva',
    email: `teste&${NOW}@novaandradina.org`,
    password: 'Biaisa699600#',
    confirm_password: 'Biaisa699600#'
}

describe('Suite de teste do usuario', () => {
    let token = ''

    it('/signup - deve cadatrar um novo usuário.', (done) => {
        chai.request(BASE_OPEN_URL)
            .post('/signup')
            .send(USER)
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('token')
                token = res.body.token
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/signup - não deve cadatrar um novo usuário: O e-mail informado está inválido.', (done) => {
        const usuario = { ...USER, email: 'teste.teste.novaandradina.org'}
        chai.request(BASE_OPEN_URL)
            .post('/signup')
            .send(usuario)
            .then( res => {
                res.should.have.status(400)
                res.body.should.have.property('errors')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/signup - não deve cadatrar um novo usuário: Senhas não conferem.', (done) => {
        const usuario = { ...USER, confirm_password: 'Biaisa6996#'}
        chai.request(BASE_OPEN_URL)
            .post('/signup')
            .send(usuario)
            .then( res => {
                res.should.have.status(400)
                res.body.should.have.property('errors')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/signup - não deve cadatrar um novo usuário: Senha inválida.', (done) => {
        const usuario = { ...USER, password: 'biaisa699600#'}
        chai.request(BASE_OPEN_URL)
            .post('/signup')
            .send(usuario)
            .then( res => {
                res.should.have.status(400)
                res.body.should.have.property('errors')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/login - deve efetuar autenticação', (done) => {
        chai.request(BASE_OPEN_URL)
            .post('/login')
            .send(USER)
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('token')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/login - não deve efetuar autenticação: Usuário/Senha inválidos', (done) => {
        const usuario = { ...USER, password: 'biaisa699600#'}
        chai.request(BASE_OPEN_URL)
            .post('/login')
            .send(usuario)
            .then( res => {
                res.should.have.status(400)
                res.body.should.have.property('errors')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/forgotPassword - deve retornar sucesso', (done) => {
        chai.request(BASE_OPEN_URL)
            .post('/forgotPassword')
            .send(USER)
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('success')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/forgotPassword - não deve retornar sucesso', (done) => {
        const usuario = { ...USER, email: 'emailfalse@novaandradina.org'}
        chai.request(BASE_OPEN_URL)
            .post('/forgotPassword')
            .send(usuario)
            .then( res => {
                res.should.have.status(400)
                res.body.should.have.property('errors')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/validateToken - deve validar o token', (done) => {
        chai.request(BASE_OPEN_URL)
            .post('/validateToken')
            .send( {token} )
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('valid')

                res.body.valid.should.be.equal(true)
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/validateToken - não deve validar o token', (done) => {
        chai.request(BASE_OPEN_URL)
            .post('/validateToken')
            .send( {token: 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnsicGFzc3dvcmRSZXNldFRva2VuIjowLCJwYXNzd29yZFJlc2V0RXhwaXJlcyI6MH0sImdldHRlcnMiOnt9LCJfaWQiOiI1ZDlhNDg0MzE4ZjFkZDI5NzkyNDMyYTgiLCJ3YXNQb3B1bGF0ZWQiOmZhbHNlLCJhY3RpdmVQYXRocyI6eyJwYXRocyI6eyJwYXNzd29yZCI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJuYW1lIjoiaW5pdCIsIl9pZCI6ImluaXQiLCJfX3YiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfaWQiOnRydWUsIm5hbWUiOnRydWUsImVtYWlsIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwiX192Ijp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwicGF0aHNUb1Njb3BlcyI6e30sImNhY2hlZFJlcXVpcmVkIjp7fSwiZW1pdHRlciI6eyJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfSwiJG9wdGlvbnMiOnsic2tpcElkIjp0cnVlLCJpc05ldyI6ZmFsc2UsIndpbGxJbml0Ijp0cnVlfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJfaWQiOiI1ZDlhNDg0MzE4ZjFkZDI5NzkyNDMyYTgiLCJuYW1lIjoiVGVzdGUgZGEgU2lsdmEiLCJlbWFpbCI6InRlc3RlJjE1NzAzOTIxMzE2ODNAbm92YWFuZHJhZGluYS5vcmciLCJwYXNzd29yZCI6IiQyYiQxMCRuemU3NHlkVW1pUWc3RUluanpLOUpPandkSG9yWUNhQmhRR2EwWEp2YVZxWDdLQ2FmN0xGUyIsIl9fdiI6MH0sIiRpbml0Ijp0cnVlLCJpYXQiOjE1NzAzOTIxMzIsImV4cCI6MTU3MDQ3ODUzMn0.RITfkpzgovA3-ogUpD6kZR2B5yaXx4U99J_quW1PrVE'} )
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('valid')

                res.body.valid.should.be.equal(false)
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })
})