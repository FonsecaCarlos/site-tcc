const restful = require('node-restful')
const mongoose = restful.mongoose
//const Author = mongoose.model('User')

const narrativeTextSchema = new mongoose.Schema({
    author: { type: String /*Author*/, required: true },
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: [true, 'Informe o título do texto!'] },
    text: { type: String, required: [true, 'Texto vazio!'] },
    status: { type: String, required: true, uppercase: true,
        enum: ['CONCLUIDO', 'PENDENTE', 'ABERTO'] }
})

module.exports = restful.model('NarrativeText', narrativeTextSchema)