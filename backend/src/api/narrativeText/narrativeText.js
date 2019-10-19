const restful = require('node-restful')
const mongoose = restful.mongoose
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate')
const ObjectId = mongoose.Schema.Types.ObjectId

/**
 * @swagger
 * definition:
 *   Create_NarrativeText:
 *     description: Informaçãoes necessárias para a criação de uma nova história
 *     type: object
 *     properties:
 *       author:
 *         type: string 
 *         description: Id do autor gerado pelo MongoDB
 *       title:
 *         type: string
 *       text:
 *         type: string
 */

/**
 * @swagger
 * definition:
 *   Create_Alternative_NarrativeText:
 *     description: Informaçãoes necessárias para a criação de uma nova história
 *     type: object
 *     properties:
 *       narrativeText:
 *         type: object 
 *         $ref: '#/definitions/Create_NarrativeText'
 *       idHistory:
 *         type: string
 *         description: Id da história gerado pelo MongoDB.
 */

/**
 * @swagger
 * definition:
 *   Edit_NarrativeText:
 *     description: Informaçãoes necessárias para a criação de uma nova história
 *     type: object
 *     properties:
 *       narrativeText:
 *         type: object
 *         properties:
 *            _id:
 *              type: string
 *              description: Id gerado pelo MongoDB.
 *            title:
 *              type: string
 *            text:
 *              type: string
 *            status: 
 *              type: string
 *              description: Situação da história
 *              enum:
 *                  - CONCLUIDO
 *                  - ABERTO
 *            isPublic:
 *              type: boolean
 *              default: true
 *       idAuthor:
 *         type: string
 *         description: Id do author da história gerado pelo MongoDB.
 */ 

/**
 * @swagger
 * definition:
 *   NarrativeText_Response:
 *     type: object
 *     properties:
 *       author:
 *         type: object 
 *         properties:
 *             name:
 *                 type: string
 *       createdAt:
 *         type: string
 *       title:
 *         type: string
 *       text:
 *         type: string
 *       status: 
 *         type: string
 *         description: Situação da história
 *         enum:
 *           - CONCLUIDO
 *           - ABERTO
 *       isPublic:
 *         type: boolean
 *         default: true
 *       isMaster:
 *         type: boolean
 *         default: true
 *       isAuthor:
 *         type: boolean
 *       historyMaster:
 *         type: boolean
 *       likes:
 *         type: integer
 *       liked:
 *         type: boolean
 */

 /**
 * @swagger
 * definition:
 *   Response:
 *     type: object
 *     properties:
 *       data:
 *         type: array
 *         items:
 *             $ref: '#/definitions/NarrativeText_Response'
 *       pageCount:
 *         type: integer
 *       totalCount:
 *         type: integer
 */

/**
 * @swagger
 * definition:
 *   NarrativeText:
 *     type: object
 *     properties:
 *       author:
 *         type: string 
 *         description: Id do autor gerado pelo MongoDB
 *       createdAt:
 *         type: string
 *       title:
 *         type: string
 *       text:
 *         type: string
 *       status: 
 *         type: string
 *         description: Situação da história
 *         enum:
 *           - CONCLUIDO
 *           - ABERTO
 *       isPublic:
 *         type: boolean
 *         default: true
 *       isMaster:
 *         type: boolean
 *         default: true
 *       alternativeText:
 *         type: array
 *         items:
 *             properties:
 *                 ObjectId: 
 *                     type: string
 *                     description: ObjectId gerado pelo MongoDB das histórias alternativas.
 *       sharedWith:
 *         type: array
 *         items:
 *             properties:
 *                 ObjectId: 
 *                     type: string
 *                     description: ObjectId gerado pelo MongoDB dos autores que compartilharam o texto
 *       historyMaster:
 *         type: string 
 *         description: ObjectId gerado pelo MongoDB da História mãe
 *       likes:
 *         type: array
 *         items:
 *             properties:
 *                 ObjectId: 
 *                     type: string
 *                     description: ObjectId gerado pelo MongoDB dos autores que curtiram o texto
 */
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