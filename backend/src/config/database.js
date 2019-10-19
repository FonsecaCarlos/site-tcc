const mongoose = require('mongoose')
const env = require('../.env')

mongoose.Promise = global.Promise

module.exports = mongoose.connect(env.DATABASE_URL, {useNewUrlParser:true})

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório."

mongoose.Error.messages.String.enum = "'{VALUE}' não é válido para o atributo '{PATH}'."