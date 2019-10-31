const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const assert = require('assert')
const env = require('../src/.env')
require('../src/loader')

chai.use(chaiHttp)

const BASE_OPEN_URL = env.OAPI
const BASE_PROTECTED_URL = env.API

const NOW = Date.now()
const USER = {
    _id: '',
    name: 'Teste da Silva',
    email: `teste&${NOW}@novaandradina.org`,
    password: 'Biaisa699600#',
    confirm_password: 'Biaisa699600#'
}
const NARRATIVE_TEXT = {
    author: '',
    title: 'TEXTO DE TESTE',
    text: 'Texte de teste para criação de uma nova história.'
}
const ALTERNATIVE_TEXT = {
    author: '',
    title: 'TEXTO ALTERNATIVO DE TESTE',
    text: 'Texte alternativo de teste para criação de uma nova história.'
}

describe('Suite de teste dos Textos Narrativos', () => {
    let token = ''

    before('/signup - deve cadatrar um novo usuário.', (done) => {
        chai.request(BASE_OPEN_URL)
            .post('/signup')
            .send(USER)
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('token')
                token = res.body.token
                USER._id = res.body._id
                NARRATIVE_TEXT.author = res.body._id
                ALTERNATIVE_TEXT.author = res.body._id
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText - deve criar uma nova histórias para o usuário autenticado.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .post('/')
            .set('authorization', token)
            .send( NARRATIVE_TEXT )
            .then( res => {
                res.should.have.status(201)
                res.body.should.have.property('text')
                res.body.should.have.property('status')
                res.body.should.have.property('isPublic')
                res.body.should.have.property('isMaster')
                res.body.should.have.property('alternativeText')
                res.body.should.have.property('likes')
                res.body.should.have.property('_id')
                res.body.should.have.property('author')
                res.body.should.have.property('title')
                res.body.author.should.be.equal(USER._id)
                NARRATIVE_TEXT._id = res.body._id
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/index - deve listar as histórias do usuário autenticado.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .get('/index')
            .set('authorization', token)
            .query({page: 1, idAuthor: USER._id})
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('data')
                res.body.should.have.property('pageCount')
                res.body.should.have.property('totalCount')
                res.body.totalCount.should.be.equal(1)
                res.body.pageCount.should.be.equal(1)
                res.body.data.should.be.a('array')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/indexPublic - deve listar apenas histórias públicas.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .get('/indexPublic')
            .set('authorization', token)
            .query({page: 1, idAuthor: USER._id})
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('data')
                res.body.should.have.property('pageCount')
                res.body.should.have.property('totalCount')
                res.body.data.should.be.a('array')
                const data = res.body.data
                const isPublic = true
                data.forEach(element => {
                    if(element.isPublic===false)
                        isPublic = false
                })
                assert.ok(isPublic, true)
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/indexHistory - deve retornar apenas uma histórias.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .get('/indexHistory')
            .set('authorization', token)
            .query({page: 1, idAuthor: USER._id, idHistory: NARRATIVE_TEXT._id})
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('data')
                res.body.should.have.property('pageCount')
                res.body.should.have.property('totalCount')
                res.body.totalCount.should.be.equal(1)
                res.body.pageCount.should.be.equal(1)
                res.body.data.should.be.a('array')
                
                const data = res.body.data[0]

                assert.equal(data._id, NARRATIVE_TEXT._id)
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/searchHistory - deve pesquisar histórias pelo título.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .get('/searchHistory')
            .set('authorization', token)
            .query({page: 1, idAuthor: USER._id, title: NARRATIVE_TEXT.title})
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('data')
                res.body.should.have.property('pageCount')
                res.body.should.have.property('totalCount')
                res.body.data.should.be.a('array')
                
                const data = res.body.data
                const isTitle = true
                data.forEach(element => {
                    if(element.title!==NARRATIVE_TEXT.title)
                        isTitle = false
                })
                assert.ok(isTitle, true)

                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/addAlternativeText - deve adicionar enredo alternativo.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .post('/addAlternativeText')
            .set('authorization', token)
            .send({ narrativeText: ALTERNATIVE_TEXT, idHistory: NARRATIVE_TEXT._id})
            .then( res => {
                res.should.have.status(201)
                res.body.should.have.property('text')
                res.body.should.have.property('status')
                res.body.should.have.property('isPublic')
                res.body.should.have.property('isMaster')
                res.body.should.have.property('alternativeText')
                res.body.should.have.property('likes')
                res.body.should.have.property('_id')
                res.body.should.have.property('author')
                res.body.should.have.property('title')
                res.body.should.have.property('historyMaster')
                res.body.author.should.be.equal(USER._id)
                res.body.isMaster.should.be.equal(false)
                res.body.historyMaster.should.be.equal(NARRATIVE_TEXT._id)
                ALTERNATIVE_TEXT._id = res.body._id
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/addAlternativeText - não deve adicionar enredo alternativo. Author inválido!', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .post('/addAlternativeText')
            .set('authorization', token)
            .send({ narrativeText: { ...ALTERNATIVE_TEXT, author: NARRATIVE_TEXT._id  },
                idHistory: NARRATIVE_TEXT._id })
            .then( res => {
                res.should.have.status(404)
                res.body.should.have.property('errors')
                const erros = res.body.errors
                assert.equal(erros[0], 'Author inválido!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/addAlternativeText - não deve adicionar enredo alternativo. Parâmetros inválidos!', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .post('/addAlternativeText')
            .set('authorization', token)
            .send({ narrativeText: {}, idHistory: NARRATIVE_TEXT._id })
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const erros = res.body.errors
                assert.equal(erros[0], 'Parâmetros inválidos!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/addAlternativeText - não deve adicionar enredo alternativo. Parâmetros inválidos!', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .post('/addAlternativeText')
            .set('authorization', token)
            .send({ narrativeText: { ...ALTERNATIVE_TEXT, author: 'teste' },
                 idHistory: NARRATIVE_TEXT._id })
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const erros = res.body.errors
                assert.equal(erros[0], 'Parâmetros inválidos!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/addAlternativeText - não deve adicionar enredo alternativo. idHistory inexistente!', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .post('/addAlternativeText')
            .set('authorization', token)
            .send({ narrativeText: ALTERNATIVE_TEXT, idHistory: USER._id })
            .then( res => {
                res.should.have.status(404)
                res.body.should.have.property('errors')
                const erros = res.body.errors
                assert.equal(erros[0], 'História não encontrada!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/putHistory - deve editar uma história.', (done) => {
        const narrativeText = { ...NARRATIVE_TEXT, isPublic: false, text: 'Teste de Edição' }
        chai.request(BASE_PROTECTED_URL)
            .put('/putHistory')
            .set('authorization', token)
            .send( { narrativeText , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('text')
                res.body.should.have.property('status')
                res.body.should.have.property('isPublic')
                res.body.should.have.property('isMaster')
                res.body.should.have.property('alternativeText')
                res.body.should.have.property('likes')
                res.body.should.have.property('_id')
                res.body.should.have.property('author')
                res.body.should.have.property('title')
                res.body.author.should.be.equal(USER._id)
                res.body.isPublic.should.be.equal(false)
                res.body.text.should.be.equal('Teste de Edição')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/putHistory - não deve editar uma história. História não encontrada!', (done) => {
        const narrativeText = { ...NARRATIVE_TEXT, _id: USER._id }
        chai.request(BASE_PROTECTED_URL)
            .put('/putHistory')
            .set('authorization', token)
            .send( { narrativeText , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(404)
                res.body.should.have.property('errors')
                res.body.errors[0].should.be.equal('História não encontrada!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/putHistory - não deve editar uma história. Parâmetros inválidos!', (done) => {
        const narrativeText = { ...NARRATIVE_TEXT, _id: USER._id }
        chai.request(BASE_PROTECTED_URL)
            .put('/putHistory')
            .set('authorization', token)
            .send( { narrativeText , idAuthor: 'teste'})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                res.body.errors[0].should.be.equal('Parâmetros inválidos!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/putHistory - não deve editar uma história. Permisão negada!', (done) => {
        const narrativeText = { ...NARRATIVE_TEXT, text: 'Teste de Edição de Historia' }
        chai.request(BASE_PROTECTED_URL)
            .put('/putHistory')
            .set('authorization', token)
            .send( { narrativeText , idAuthor: ALTERNATIVE_TEXT._id})
            .then( res => {
                res.should.have.status(403)
                res.body.should.have.property('errors')
                res.body.errors[0].should.be.equal('Permisão negada!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/addLike - deve adicionar um like para a história.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/addLike')
            .set('authorization', token)
            .query( { idHistory: NARRATIVE_TEXT._id , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('likes')
                res.body.should.have.property('liked')
                res.body.likes.should.be.equal(1)
                res.body.liked.should.be.equal(true)
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/addLike - não deve adicionar um like para a história.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/addLike')
            .set('authorization', token)
            .query( { idHistory: NARRATIVE_TEXT._id , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const error = res.body.errors
                assert.equal(error[0], 'Texto já curtido!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })
    
    it('/api/narrativeText/addLike - não deve adicionar um like, dados inválidos.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/addLike')
            .set('authorization', token)
            .query( { idHistory: 'teste' , idAuthor: 'teste'})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const error = res.body.errors
                assert.equal(error[0], 'Parametros inválidos!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })
    
    it('/api/narrativeText/addLike - não deve adicionar um like para a história. Id da historia inexistente', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/addLike')
            .set('authorization', token)
            .query( { idHistory: '5da5c0ac3ebe3e0f73cae80d' , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const erros = res.body.errors
                assert.equal(erros[0], 'História não encontrada!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/addLike - não deve adicionar um like para a história. Id do author inexistente', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/addLike')
            .set('authorization', token)
            .query( { idHistory: NARRATIVE_TEXT._id , idAuthor: '5da5c339f6573210dc8412aa'})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const erros = res.body.errors
                assert.equal(erros[0], 'Author não encontrado!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/removeLike - deve remover like da história.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/removeLike')
            .set('authorization', token)
            .query( { idHistory: NARRATIVE_TEXT._id , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('likes')
                res.body.should.have.property('liked')
                res.body.likes.should.be.equal(0)
                res.body.liked.should.be.equal(false)
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/removeLike - não deve remover like da história.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/removeLike')
            .set('authorization', token)
            .query( { idHistory: NARRATIVE_TEXT._id , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const error = res.body.errors
                assert.equal(error[0], 'Texto já descurtido!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })
    
    it('/api/narrativeText/removeLike - não deve remvoer like, dados inválidos.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/removeLike')
            .set('authorization', token)
            .query( { idHistory: 'teste' , idAuthor: 'teste'})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const error = res.body.errors
                assert.equal(error[0], 'Parametros inválidos!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })
    
    it('/api/narrativeText/removeLike - não deve remover like da história. Id da historia inexistente', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/removeLike')
            .set('authorization', token)
            .query( { idHistory: '5da5c0ac3ebe3e0f73cae80d' , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const erros = res.body.errors
                assert.equal(erros[0], 'História não encontrada!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/removeLike - não deve remover like da história. Id do author inexistente', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .put('/removeLike')
            .set('authorization', token)
            .query( { idHistory: NARRATIVE_TEXT._id , idAuthor: '5da5c339f6573210dc8412aa'})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                const erros = res.body.errors
                assert.equal(erros[0], 'Texto já descurtido!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/deleteHistory - não deve deletar história que possui enredo alternativo.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .delete('/deleteHistory')
            .set('authorization', token)
            .query( { idHistory: NARRATIVE_TEXT._id , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                res.body.errors[0].should.be.equal('Não é possível remover uma história com enredo alternativo!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/deleteHistory - deve deletar um enredo alternativo.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .delete('/deleteHistory')
            .set('authorization', token)
            .query( { idHistory: ALTERNATIVE_TEXT._id , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(200)
                res.body.should.have.property('success')
                res.body.success.should.be.equal('Texto removido com sucesso.')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/deleteHistory - não deve deletar história. Parametros inválidos!.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .delete('/deleteHistory')
            .set('authorization', token)
            .query( { idHistory: 'teste' , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(500)
                res.body.should.have.property('errors')
                res.body.errors[0].should.be.equal('Parametros inválidos!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/deleteHistory - não deve deletar história. História não encontrada!.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .delete('/deleteHistory')
            .set('authorization', token)
            .query( { idHistory: ALTERNATIVE_TEXT._id , idAuthor: USER._id})
            .then( res => {
                res.should.have.status(404)
                res.body.should.have.property('errors')
                res.body.errors[0].should.be.equal('História não encontrada!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })

    it('/api/narrativeText/deleteHistory - não deve deletar história. Permissão negada!.', (done) => {
        chai.request(BASE_PROTECTED_URL)
            .delete('/deleteHistory')
            .set('authorization', token)
            .query( { idHistory: NARRATIVE_TEXT._id , idAuthor: ALTERNATIVE_TEXT._id})
            .then( res => {
                res.should.have.status(403)
                res.body.should.have.property('errors')
                res.body.errors[0].should.be.equal('Permissão negada!')
                done()
            })
            .catch( error => {
                console.log('error', error)
            })
    })
})