const restful = require('node-restful')

const mongoose = restful.mongoose

/**
 * @swagger
 * definition:
 *   User:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       confirmPassword:
 *         type: string
 *       passwordResetToken:
 *         type: string
 *       passwordResetExpires:
 *         type: string
 */
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, min: 6, required: true },
    passwordResetToken: { type: String, select: false},
    passwordResetExpires: { type: Date, select: false}
})

module.exports = restful.model('User', userSchema)