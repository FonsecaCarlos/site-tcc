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

const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''

    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ ...user }, env.authSecret, {
                expiresIn: "1 day"
            })
            const { name, email, _id } = user
            res.json({ name, email, _id, token })
        } else {
            return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })
        }
    })
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''

    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
}

const signup = (req, res, next) => {
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''

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
                    return res.status(400).json({ errors: [errors] })
                }
            } else {
                return res.status(400).json({ errors: ['Usuário não encontrado.'] })
            }
        })
    } catch (error) {
        res.status(400).json({ errors: ['Erro ao recuperar senha. Por favor, tente novamente!'] })
    }
}

const resetPassword = async (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''
    const token = req.body.token || ''
    
    try {
        User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')
            .exec((error, user) => {
                if (token !== user.passwordResetToken)
                    return res.status(400).json({ errors: ['Token inválido!'] })

                const now = new Date()

                if (now > user.passwordResetExpires)
                    return res.status(400).json({ errors: ['Token expidado. Por favor, crie um novo token!'] })

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
        res.status(400).json({ errors: ['Erro ao resetar senha. Por favor, tente novamente!'] })
    }
}

module.exports = { login, signup, validateToken, forgotPassword, resetPassword }