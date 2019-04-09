const restful = require('node-restful')
const mongoose = restful.mongoose
const mongoosePaginate = require('mongoose-paginate');

const NarrativeTextSchema = new mongoose.Schema({
    author: { type: String /*Author*/, required: true },
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: [true, 'Informe o título do texto!'] },
    text: { type: String, required: [true, 'Texto vazio!'] },
    status: { type: String, default: 'ABERTO',required: true, uppercase: true,
        enum: ['CONCLUIDO', 'ABERTO'] },
    isPublic: { type: Boolean, default: true},
    alternativeText: { type: [String], required: false }
})

NarrativeTextSchema.plugin(mongoosePaginate)

module.exports = restful.model('NarrativeText', NarrativeTextSchema)