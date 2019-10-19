const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const emailService = require('./emailService')

const User = require('./user')
const env = require('../../.env')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

/**
 * @swagger
 * /oapi/login:
 *    post:
 *      description: Efetuar autenticação do usuário. Retorna => { name, email, _id, token }
 *      tags:
 *          - Usuários
 *      summary: Efetuar autenticação do usuário
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: Obrigatório apenas => email e password.
 *            required: true
 *            schema:
 *                $ref: '#/definitions/User'
 *      responses:
 *          200:
 *              description: Usuário autenticado.
 *          400:
 *              description: Usuário/Senha inválidos.
 */
const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''

    try {
        User.findOne({ email }, (err, user) => {
            if (err) {
                return sendErrorsFromDB(res, err)
            } else if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({ ...user }, env.AUTH_SECRET, {
                    expiresIn: "1 day"
                })
                const { name, email, _id } = user
                res.json({ name, email, _id, token })
            } else {
                return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })
            }
        })
    } catch (e) {
        return res.status(400).send({ errors: ['Não foi possível efetuar autenticação. Por favor, tente novamente!'] })
    }
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''

    jwt.verify(token, env.AUTH_SECRET, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
}

/**
 * @swagger
 * /oapi/signup:
 *    post:
 *      description: Cadastrar usuário
 *      tags:
 *          - Usuários
 *      summary: Cadastrar um novo usuário
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: Obrigatório apenas => name, email, password e confirmPasssword.
 *            required: true
 *            schema:
 *                $ref: '#/definitions/User'
 *      responses:
 *          '200':
 *              description: Usuário cadastrado
 *          '400':
 *              description: Usuário não cadastrado
 */
const signup = (req, res, next) => {
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || req.body.confirmPassword || ''

    if (!email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informado está inválido'] })
    }

    if (!password.match(passwordRegex)) {
        return res.status(400).send({
            errors: [
                "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20."
            ]
        })
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)

    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        } else {
            const newUser = new User({ name, email, password: passwordHash })
            newUser.save(err => {
                if (err) {
                    return sendErrorsFromDB(res, err)
                } else {
                    login(req, res, next)
                }
            })
        }
    })
}

/**
 * @swagger
 * /oapi/forgotPassword:
 *    post:
 *      description: Usuário esqueceu a senha - solicitar acesso.
 *      tags:
 *          - Usuários
 *      summary: Usuário esqueceu a senha
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: Obrigatório apenas => email.
 *            required: true
 *            schema:
 *                $ref: '#/definitions/User'
 *      responses:
 *          200:
 *              description: E-mail enviado com as orientações para redefinir a senha.
 *          400:
 *              description: Usuário não encontrado.
 */
const forgotPassword = (req, res, next) => {
    const email = req.body.email || ''

    try {
        User.findOne({ email }, (err, user) => {
            if (err) {
                return sendErrorsFromDB(res, err)
            } else if (user) {
                const token = crypto.randomBytes(20).toString('hex')
                const now = new Date()
                now.setHours(now.getHours() + 1)

                user.passwordResetToken = token
                user.passwordResetExpires = now
                user.save()

                try {
                    emailService(user.email, token)
                    return res.json({ success: 'Verifique sua caixa de e-mail.' })
                } catch (errors) {
                    return res.status(400).send({ errors: [errors] })
                }
            } else {
                return res.status(400).send({ errors: ['Usuário não encontrado.'] })
            }
        })
    } catch (error) {
        res.status(400).send({ errors: ['Erro ao recuperar senha. Por favor, tente novamente!'] })
    }
}

/**
 * @swagger
 * /oapi/resetPassword:
 *    post:
 *      description: Alterar senha do usuário. O usuário deve checar sua caixa e e-mail e fornecer o token recebido
 *      tags:
 *          - Usuários
 *      summary: Alterar senha do usuário.
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: body
 *            description: Obrigatório apenas => { email, password e token}.
 *            required: true
 *            schema:
 *                $ref: '#/definitions/User'
 *      responses:
 *          200:
 *              description: Nova senha cadastrada com sucesso.
 *          400:
 *              description: Não foi possível alterar a senha.
 */
const resetPassword = (req, res, next) => {
    const { email = '', password = '', token = '' } = req.body
    //const  password = req.body.password || ''
    //const token = req.body.token || ''

    try {
        User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')
            .exec((error, user) => {
                if (token !== user.passwordResetToken)
                    return res.status(400).send({ errors: ['Token inválido!'] })

                const now = new Date()

                if (now > user.passwordResetExpires)
                    return res.status(400).send({ errors: ['Token expidado. Por favor, crie um novo token!'] })

                if (!password.match(passwordRegex)) {
                    return res.status(400).send({
                        errors: [
                            "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$%) e tamanho entre 6-20."
                        ]
                    })
                }

                const salt = bcrypt.genSaltSync()
                const passwordHash = bcrypt.hashSync(password, salt)
                user.password = passwordHash

                user.save(err => {
                    if (err) {
                        return sendErrorsFromDB(res, err)
                    } else {
                        login(req, res, next)
                    }
                })
            })
    } catch (error) {
        res.status(400).send({ errors: ['Erro ao resetar senha. Por favor, tente novamente!'] })
    }
}

module.exports = { login, signup, validateToken, forgotPassword, resetPassword }