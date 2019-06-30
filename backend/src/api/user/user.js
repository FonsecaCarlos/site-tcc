const restful = require('node-restful')

const mongoose = restful.mongoose

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, min: 6, required: true },
    passwordResetToken: { type: String, select: false},
    passwordResetExpires: { type: Date, select: false}
})

module.exports = restful.model('User', userSchema)