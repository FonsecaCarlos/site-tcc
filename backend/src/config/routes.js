const express = require('express')
const auth = require('./auth')

module.exports = function (server) {
    /*
    * Rotas protegidas por Token JWT
    */
    const protectedApi = express.Router()
    server.use('/api', protectedApi)
    protectedApi.use(auth)

    const NarrativeText = require('../api/narrativeText/narrativeTextService')
    NarrativeText.register(protectedApi, '/narrativeText')

    /*
    * Rotas abertas
    */
    const openApi = express.Router()
    server.use('/oapi', openApi)

    const AuthService = require('../api/user/authService')

    openApi.post('/login', AuthService.login)
    openApi.post('/signup', AuthService.signup)
    openApi.post('/validateToken', AuthService.validateToken)
    openApi.post('/forgotPassword', AuthService.forgotPassword)
    openApi.post('/resetPassword', AuthService.resetPassword)



    const swaggerUi = require('swagger-ui-express')
    const swaggerJsdoc = require('swagger-jsdoc')
    const options = {
        definition: {
            info: {
                title: 'NarrativeText API',
                version: '1.0.0',
                description: 'Documentação da API e das rotas de acesso da aplicação.'
            }
        },
        contact: {
            email: 'carlos.fonseca@novaandradina.org'
        },
        apis: ['src/api/user/*.js', 'src/api/narrativeText/*.js']
    }
    const specs = swaggerJsdoc(options)
    server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

    server.use('/coverage', express.static('./coverage'))
}