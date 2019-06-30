const restful = require('node-restful')
const mongoose = restful.mongoose
const mongoosePaginate = require('mongoose-paginate')
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate')
const ObjectId = mongoose.Schema.Types.ObjectId

const NarrativeTextSchema = new mongoose.Schema({
    author: { type: ObjectId, required: [true, 'Id do autor não informado!'] },
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: [true, 'Informe o título do texto!'] },
    text: { type: String, required: false, default:'' },
    status: { type: String, default: 'ABERTO',required: true, uppercase: true,
        enum: ['CONCLUIDO', 'ABERTO'] },
    isPublic: { type: Boolean, default: true},
    isMaster: { type: Boolean, default: true },
    alternativeText: { type: [ObjectId], required: false },
    sharedWith: { type: [ObjectId], required: false },
    historyMaster: { type: ObjectId, required: false},
    likes: { type: [ObjectId], required: false}
})

NarrativeTextSchema.plugin(mongooseAggregatePaginate)

module.exports = restful.model('NarrativeText', NarrativeTextSchema)