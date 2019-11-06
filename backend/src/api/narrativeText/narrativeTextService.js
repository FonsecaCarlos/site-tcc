const NarrativeText = require('./narrativeText')
const User = require('../user/user')
const errorHandler = require('../common/errorHandler')

const restful = require('node-restful')
const mongoose = restful.mongoose
const ObjectId = mongoose.Types.ObjectId

NarrativeText.methods(['post'])
NarrativeText.updateOptions({ new: true, runValidators: true })
NarrativeText.after('post', errorHandler).after('put', errorHandler)

//index - rota de paginação => são retornados todas as 
//historias de um determinado author
/**
 * @swagger
 * /api/narrativeText/index?page={page}&idAuthor={idAuthor}:
 *   get:
 *     tags:
 *       - Histórias
 *     summary: Retorna as histórias do autor autenticado.
 *     description: Rota de paginação, são retornadas 12 histórias por página do usuário autenticado.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - name: page
 *         in: query
 *         required: true
 *         type: integer
 *       - name: idAuthor
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Lista paginada das histórias.
 *         schema:
 *           $ref: '#/definitions/Response'
 *       500:
 *         description: Erro interno no servidor
 */
const index = (req, res, next) => {
    const { page = 1, idAuthor = "" } = req.query

    if (!ObjectId.isValid(idAuthor))
        return res.status(500).json({ errors: ['Parametros inválidos!'] })

    const idAuth = new ObjectId(idAuthor)

    const aggregate = NarrativeText.aggregate()
    aggregate.lookup({
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
    })
        .unwind("author")
        .match({
            "author._id": idAuth
        })
        .addFields({
            isAuthor: {
                $cond: [{ $eq: ["$author._id", idAuth] }, true, false]
            },
            liked: {
                $cond: {
                    if: { $isArray: "$likes" },
                    then: { $in: [idAuth, "$likes"] },
                    else: false
                }
            },
            likes: {
                $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 }
            }
        })
        .project({
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: {
                _id: 0, password: 0, email: 0, passwordResetExpires: 0,
                passwordResetToken: 0, __v: 0
            },
            alternativeText: 0
        }).sort({ createdAt: -1 })

    NarrativeText.aggregatePaginate(aggregate, { page, limit: 12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

//indexPublic - rota de paginação => são retornados todas as 
//historias públicas e master
/**
 * @swagger
 * /api/narrativeText/indexPublic?page={page}&idAuthor={idAuthor}:
 *   get:
 *     tags:
 *       - Histórias
 *     summary: Retorna as histórias públicas.
 *     description: Rota de paginação, são retornadas 12 histórias públicas por página.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - name: page
 *         in: query
 *         required: true
 *         type: integer
 *       - name: idAuthor
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Lista paginada das histórias.
 *         schema:
 *           $ref: '#/definitions/Response'
 *       500:
 *         description: Erro interno no servidor
 */
const indexPublic = (req, res, next) => {
    const { page = 1, idAuthor = '' } = req.query

    if (!ObjectId.isValid(idAuthor))
        return res.status(500).json({ errors: ['Parametros inválidos!'] })

    const idAuth = new ObjectId(idAuthor)

    const aggregate = NarrativeText.aggregate()
    aggregate.lookup({
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
    })
        .unwind("author")
        .match({
            "isPublic": true,
            "isMaster": true
        })
        .addFields({
            isAuthor: {
                $cond: [{ $eq: ["$author._id", idAuth] }, true, false]
            },
            liked: {
                $cond: {
                    if: { $isArray: "$likes" },
                    then: { $in: [idAuth, "$likes"] },
                    else: false
                }
            },
            likes: {
                $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 }
            }
        })
        .project({
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: {
                _id: 0, password: 0, email: 0, passwordResetExpires: 0,
                passwordResetToken: 0, __v: 0
            },
            alternativeText: 0
        })
        .sort({ createdAt: -1 })

    NarrativeText.aggregatePaginate(aggregate, { page, limit: 12 })
        .then((narrativeText) => {
            return res.status(200).json(narrativeText)
        })
        .catch((errors) => {
            return res.status(500).json(errors)
        })
}

//indexHistory - rota get => retorna uma historia com o name do author
//e é adicionado um campo isAuthor para saber é ele é o dono da historia
/**
 * @swagger
 * /api/narrativeText/indexHistory?idHistory={idHistory}&idAuthor={idAuthor}:
 *   get:
 *     tags:
 *       - Histórias
 *     summary: Retorna apenas uma história.
 *     description: Rota de paginação, mas é retornada apenas uma histórias. Ela deve ser pública ou possuir o id do autor.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - name: idHistory
 *         in: query
 *         required: true
 *         type: string
 *       - name: idAuthor
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Lista paginada das histórias.
 *         schema:
 *           $ref: '#/definitions/Response'
 */
const indexHistory = (req, res, next) => {
    const { idHistory = '', idAuthor = '' } = req.query

    if (!ObjectId.isValid(idHistory) || !ObjectId.isValid(idAuthor))
        return res.status(500).json({ errors: ['Parametros inválidos!'] })

    const idHist = new ObjectId(idHistory)
    const idAuth = new ObjectId(idAuthor)

    const aggregate = NarrativeText.aggregate()
    aggregate.lookup({
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author"
        })
        .unwind("author")
        .match({
            "_id": idHist
        })
        .lookup({
            from: "narrativetexts", localField: "alternativeText",
            foreignField: "_id", as: "alternativeText"
        })
        .addFields({
            isAuthor: {
                $cond: [{ $eq: ["$author._id", idAuth] }, true, false]
            },
            liked: {
                $cond: {
                    if: { $isArray: "$likes" },
                    then: { $in: [idAuth, "$likes"] },
                    else: false
                }
            },
            likes: {
                $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 }
            },
            alternativeText: {
                $map: {
                    input: "$alternativeText",
                    as: "row",
                    in: {
                        _id: "$$row._id",
                        title: "$$row.title",
                        author: "$$row.author",
                        isPublic: "$$row.isPublic",
                        liked: {
                            $cond: {
                                if: { $isArray: "$$row.likes" },
                                then: { $in: [idAuth, "$$row.likes"] },
                                else: false
                            }
                        },
                        likes: {
                            $cond: {
                                if: { $isArray: "$$row.likes" },
                                then: { $size: "$$row.likes" }, else: 0
                            }
                        }
                    }
                }
            }
        })
        .lookup({
            from: "users",
            localField: "alternativeText.author",
            foreignField: "_id",
            as: "authorAlternative"
        })
        .addFields({
            alternativeText: {
                $filter: {
                    input: "$alternativeText",
                    as: "alternativeText",
                    cond: {
                        $or: [
                            { $eq: ["$$alternativeText.isPublic", true] },
                            { $eq: ["$$alternativeText.author", idAuth] }
                        ]
                    }
                }
            }
        })
        .addFields({
            alternativeText: {
                $map: {
                    input: "$alternativeText",
                    as: "row",
                    in: {
                        _id: "$$row._id",
                        title: "$$row.title",
                        isPublic: "$$row.isPublic",
                        liked: "$$row.liked",
                        likes: "$$row.likes",
                        author: "$$row.author",
                        authorIndex: { $indexOfArray: [ "$authorAlternative._id", "$$row.author" ] }
                    }
                }
            }
        })
        .addFields({
            alternativeText: {
                $map: {
                    input: "$alternativeText",
                    as: "row",
                    in: {
                        _id: "$$row._id",
                        title: "$$row.title",
                        isPublic: "$$row.isPublic",
                        liked: "$$row.liked",
                        likes: "$$row.likes",
                        author: { $arrayElemAt: [ "$authorAlternative.name", "$$row.authorIndex" ] }
                    }
                }
            }
        })
        .project({
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: {
                _id: 0, password: 0, email: 0, __v: 0,
                passwordResetExpires: 0, passwordResetToken: 0
            },
            authorAlternative: 0
        })

    NarrativeText.aggregatePaginate(aggregate)
        .then((narrativeText) => {
            return res.status(200).json(narrativeText)
        })
        .catch((errors) => {
            return res.status(500).json(errors)
        })
}

//searchHistory - rota de paginação => são retornados todas as 
//historias publicas e todas do author com o titulo pesquisado
/**
 * @swagger
 * /api/narrativeText/searchHistory?page={page}&idAuthor={idAuthor}&title={title}:
 *   get:
 *     tags:
 *       - Histórias
 *     summary: Retorna as histórias pesquisadas.
 *     description: Rota de paginação, são retornadas 12 histórias por página.
 *         Serão retornadas apenas as histórias que possuírem no título um trecho do texto informado.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - name: page
 *         in: query
 *         required: true
 *         type: integer
 *       - name: idAuthor
 *         in: query
 *         required: true
 *         type: string
 *       - name: title
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Lista paginada das histórias que possuem no título a palavra pesquisada.
 *         schema:
 *           $ref: '#/definitions/Response'
 *       500:
 *         description: Erro interno no servidor
 */
const searchHistory = (req, res, next) => {
    const { idAuthor = "", title = "", page = 1 } = req.query

    if (!ObjectId.isValid(idAuthor))
        return res.status(500).json({ errors: ['Parametros inválidos!'] })

    const idAuth = new ObjectId(idAuthor)

    const aggregate = NarrativeText.aggregate()
    aggregate.lookup({
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
    })
        .unwind("author")
        .match({
            $or: [
                { "isPublic": true },
                { "author._id": idAuth }
            ],
            "title": { $regex: title, $options: 'i' }
        })
        .addFields({
            isAuthor: {
                $cond: [{ $eq: ["$author._id", idAuth] }, true, false]
            },
            liked: {
                $cond: {
                    if: { $isArray: "$likes" },
                    then: { $in: [idAuth, "$likes"] },
                    else: false
                }
            },
            likes: {
                $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 }
            }
        })
        .project({
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: {
                password: 0, email: 0, _id: 0, __v: 0,
                passwordResetExpires: 0, passwordResetToken: 0
            },
            alternativeText: 0
        })
        .sort({ createdAt: -1 })

    NarrativeText.aggregatePaginate(aggregate, { page, limit: 12 })
        .then((narrativeText) => {
            return res.status(200).json(narrativeText)
        })
        .catch((errors) => {
            return res.status(500).json(errors)
        })
}

//api/narrativeText - Documentação do SwaggerJS
//Cria uma nova história
/**
 * @swagger
 * /api/narrativeText:
 *   post:
 *     tags:
 *       - Histórias
 *     summary: Cria uma nova história
 *     description: Cria uma nova história. Essa rota é protegida por token.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Informações necessárias para a criação de um enredo alternativo.
 *         required: true
 *         type: object
 *         schema:
 *             $ref: '#/definitions/Create_NarrativeText'
 *     responses:
 *       201:
 *         description: Texto alternativo criado com sucesso.
 *         schema:
 *             $ref: '#/definitions/NarrativeText'
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /api/narrativeText/addAlternativeText:
 *   post:
 *     tags:
 *       - Histórias
 *     summary: Cria um enredo alternativo.
 *     description: Cria um novo enredo alternativo para uma história já criada
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Informações necessárias para a criação de um enredo alternativo.
 *         required: true
 *         type: object
 *         schema:
 *             $ref: '#/definitions/Create_Alternative_NarrativeText'
 *     responses:
 *       201:
 *         description: Texto alternativo criado com sucesso.
 *         schema:
 *             $ref: '#/definitions/NarrativeText'
 *       500:
 *         description: Erro interno no servidor
 */
const addAlternativeText = (req, res, next) => {
    const { narrativeText = {}, idHistory = '' } = req.body

    if (!ObjectId.isValid(idHistory) || !ObjectId.isValid(narrativeText.author) ||
        !(!!narrativeText.title))
        return res.status(500).json({ errors: ['Parâmetros inválidos!'] })

    delete narrativeText.createdAt
    delete narrativeText.alternativeText
    delete narrativeText.sharedWith
    delete narrativeText.likes

    const id = new ObjectId(idHistory)
    const idAuth = new ObjectId(narrativeText.author)

    NarrativeText.findOne({_id: id})
        .then(data => {
            if (data) {
                User.findOne({ _id: idAuth})
                    .then(user => {
                        if (!user || (narrativeText.author != user._id))
                            return res.status(404).json({ errors: ['Author inválido!'] })

                        const text = new NarrativeText({ ...narrativeText, isMaster: false, historyMaster: id })
                        text.save()
                            .then(data => {
                                const { _id } = data
                                NarrativeText.findOneAndUpdate({ _id: id }, { $push: { alternativeText: _id } })
                                    .then(alternativeText => {
                                        return res.status(201).json(data)
                                    })
                                    .catch((errors) => {
                                        return res.status(500).json(errors)
                                    })
                            })
                            .catch((errors) => {
                                return res.status(500).json(errors)
                            })
                    })
            } else {
                return res.status(404).json({ errors: ['História não encontrada!'] })
            }
        })
        .catch(errors => {
            return res.status(500).json(errors)
        })
}

/**
 * @swagger
 * /api/narrativeText/putHistory:
 *   put:
 *     tags:
 *       - Histórias
 *     summary: Edita os dados de uma história cadastrada.
 *     description: Edita os dados de uma história cadastrada.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Conteúdo do texto narrativo editado.
 *         required: true
 *         schema:
 *             $ref: '#/definitions/Edit_NarrativeText'
 *     responses:
 *       200:
 *         description: História editada com sucesso.
 *         schema:
 *           $ref: '#/definitions/NarrativeText'
 *       403:
 *         description: Permisão negada! O usuário não possui direitos sobre a história
 *       500:
 *         description: Erro interno no servidor
 */
const putHistory = (req, res, next) => {
    //Conferir como impedir do usuário mandar lixo no narrativeText
    const { narrativeText = {}, idAuthor = '' } = req.body

    if (!ObjectId.isValid(idAuthor) || !ObjectId.isValid(narrativeText._id))
        return res.status(500).json({ errors: ['Parâmetros inválidos!'] })

    delete narrativeText.author
    delete narrativeText.createdAt
    delete narrativeText.isMaster
    delete narrativeText.alternativeText
    delete narrativeText.sharedWith
    delete narrativeText.historyMaster
    delete narrativeText.likes

    const { _id } = narrativeText

    NarrativeText.findById({ _id })
        .then(text => {
            if (!text)
                return res.status(404).json({ errors: ['História não encontrada!'] })

            const { author } = text
            if (`${author}` === idAuthor) {
                NarrativeText.findOneAndUpdate({ _id }, { ...narrativeText })
                    .then(data => {
                        NarrativeText.findById({ _id })
                            .then(data => {
                                return res.status(200).json(data)
                            })
                            .catch((errors) => {
                                return res.status(500).json(errors)
                            })
                    })
                    .catch((errors) => {
                        return res.status(500).json(errors)
                    })
            } else {
                return res.status(403).json({ errors: ['Permisão negada!'] })
            }
        })
        .catch((errors) => {
            return res.status(500).json(errors)
        })
}

/**
 * @swagger
 * /api/narrativeText/addLike:
 *   put:
 *     tags:
 *       - Histórias
 *     summary: Adiciona uma curtida em uma história cadastrada.
 *     description: Edita os dados de uma história cadastrada.
 *         Retorna dois valores { likes, liked }. 
 *          Likes => (integer) indica a quantidade de curtidas da história e 
 *          Liked => (boolean) indica se o author curtiu o texto.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - in: query
 *         name: idHistory
 *         description: Id da história que se deseja curtir.
 *         required: true
 *         type: string
 *       - in: query
 *         name: idAuthor
 *         description: Id do autor que deseja curtir a história.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: História curtida com sucesso
 *       500:
 *         description: Texto já curtido ou Erro interno no servidor
 */
const addLike = (req, res, next) => {
    const { idHistory, idAuthor } = req.query

    if (!ObjectId.isValid(idHistory) || !ObjectId.isValid(idAuthor))
        return res.status(500).json({ errors: ['Parametros inválidos!'] })

    const id = new ObjectId(idHistory)
    const idAuth = new ObjectId(idAuthor)

    NarrativeText.findById(id)
        .then(data => {
            if (!data)
                return res.status(500).json({ errors: ['História não encontrada!'] })

            const exists = data.likes.indexOf(idAuth)
            if (exists === -1) {
                User.findById(idAuth)
                    .then(author => {
                        if (!author)
                            return res.status(500).json({ errors: ['Author não encontrado!'] })

                        NarrativeText.findOneAndUpdate({ _id: id }, { $push: { likes: idAuth } })
                            .then(text => {
                                return res.status(200).json({ likes: text.likes.length + 1, liked: true })
                            })
                            .catch((errors) => {
                                return res.json(errors)
                            })
                    })
                    .catch(errors => {
                        return res.status(500).json({ errors: ['Author não encontrado!'] })
                    })
            } else {
                return res.status(500).json({ errors: ['Texto já curtido!'] })
            }
        })
        .catch((errors) => {
            return res.status(500).json({ errors: ['História não encontrada!'] })
        })
}

/**
 * @swagger
 * /api/narrativeText/removeLike:
 *   put:
 *     tags:
 *       - Histórias
 *     summary: Remove uma curtida em uma história cadastrada.
 *     description: Edita os dados de uma história cadastrada.
 *         Retorna dois valores { likes, liked }. 
 *          Likes => (integer) indica a quantidade de curtidas da história e 
 *          Liked => (boolean) indica se o author curtiu o texto.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - in: query
 *         name: idHistory
 *         description: Id da história que se deseja descurtir.
 *         required: true
 *         type: string
 *       - in: query
 *         name: idAuthor
 *         description: Id do autor que deseja descurtir a história.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: História descurtida com sucesso
 *       500:
 *         description: Texto já descurtido ou Erro interno no servidor
 */
const removeLike = (req, res, next) => {
    const { idHistory, idAuthor } = req.query

    if (!ObjectId.isValid(idHistory) || !ObjectId.isValid(idAuthor))
        return res.status(500).json({ errors: ['Parametros inválidos!'] })

    const id = new ObjectId(idHistory)
    const idAuth = new ObjectId(idAuthor)

    NarrativeText.findById(id)
        .then(data => {
            if (!data)
                return res.status(500).json({ errors: ['História não encontrada!'] })

            const exists = data.likes.indexOf(idAuth)
            if (exists !== -1) {
                NarrativeText.findOneAndUpdate({ _id: id }, { $pull: { likes: idAuth } })
                    .then(text => {
                        return res.json({ likes: text.likes.length - 1, liked: false })
                    })
                    .catch((errors) => {
                        return res.status(500).json(errors)
                    })
            } else {
                return res.status(500).json({ errors: ['Texto já descurtido!'] })
            }
        })
        .catch((errors) => {
            return res.status(500).json({ errors: ['História não encontrada!'] })
        })
}

/**
 * @swagger
 * /api/narrativeText/deleteHistory:
 *   delete:
 *     tags:
 *       - Histórias
 *     summary: Remove uma história da base de dados.
 *     description: Remove uma história cadastrada.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         type: string
 *       - in: query
 *         name: idHistory
 *         description: Id da história que se deseja remover.
 *         required: true
 *         type: string
 *       - in: query
 *         name: idAuthor
 *         description: Id do autor da história.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: História removida com sucesso.
 *       403:
 *         description: Permisão negada! O usuário não possui direitos sobre a história
 *       500:
 *         description: Erro interno no servidor ou História possui enredos alternativos
 */
const deleteHistory = (req, res, next) => {
    const { idHistory, idAuthor } = req.query

    if (!ObjectId.isValid(idHistory) || !ObjectId.isValid(idAuthor))
        return res.status(500).json({ errors: ['Parametros inválidos!'] })

    const id = new ObjectId(idHistory)

    NarrativeText.findById(id)
        .then(data => {
            if (!data)
                return res.status(404).json({ errors: ['História não encontrada!'] })

            const { author, historyMaster } = data
            if ((author == idAuthor) && (data.alternativeText.length === 0)) {
                NarrativeText.findOneAndUpdate({ _id: historyMaster }, { $pull: { alternativeText: id } })
                    .then(text => {
                        NarrativeText.findByIdAndRemove(id)
                            .then(text => {
                                return res.status(200).json({ success: 'Texto removido com sucesso.' })
                            })
                            .catch((errors) => {
                                return res.status(404).json(errors)
                            })
                    })
                    .catch((errors) => {
                        return res.status(500).json(errors)
                    })
            } else if (author != idAuthor) {
                return res.status(403).json({ errors: ['Permissão negada!'] })
            } else {
                return res.status(500).json({ errors: ['Não é possível remover uma história com enredo alternativo!'] })
            }
        })
        .catch((errors) => {
            return res.status(500).json(errors)
        })
}

NarrativeText.route('index', ['get'], index)
NarrativeText.route('indexPublic', ['get'], indexPublic)
NarrativeText.route('indexHistory', ['get'], indexHistory)
NarrativeText.route('addAlternativeText', ['post'], addAlternativeText)
NarrativeText.route('searchHistory', ['get'], searchHistory)
NarrativeText.route('putHistory', ['put'], putHistory)
NarrativeText.route('addLike', ['put'], addLike)
NarrativeText.route('removeLike', ['put'], removeLike)
NarrativeText.route('deleteHistory', ['delete'], deleteHistory)

module.exports = NarrativeText


/* 
Usado na consulta IndexHIstory
Busca uma história e retorna todos os enredos alternativos públicos ou do author.

db.getCollection('narrativetexts').aggregate([
    { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author" } },
    { $unwind: "$author" },
    { $match: { "_id": ObjectId("5dbad6c62d868d0bd2054367") } },
    { $lookup: { from: "narrativetexts", localField: "alternativeText", foreignField: "_id", as: "alternativeText" } },
    { $addFields : {
            isAuthor: { $cond: [{ $eq: ["$author._id", ObjectId("5ca1127075a3b9210591d556")] }, true, false] },
            liked: { $cond: {
                        if: { $isArray: "$likes" },
                        then: { $in: [ ObjectId("5ca1127075a3b9210591d556"), "$likes" ] },
                        else: false
                    } },
            likes: { $cond: { if: { $isArray: "$likes" }, then: { $size: "$likes" }, else: 0 } },
            alternativeText: {
                $map: {
                    input: "$alternativeText",
                    as: "row",
                    in: {
                        _id: "$$row._id",
                        author: "$$row.author",
                        isPublic: "$$row.isPublic",
                        title: "$$row.title",
                        liked: {
                            $cond: {
                                if: { $isArray: "$$row.likes" },
                                then: { $in: [ ObjectId("5ca1127075a3b9210591d556"), "$$row.likes" ] },
                                else: false
                            }
                        },
                        likes: {
                            $cond: { if: { $isArray: "$$row.likes" },
                                    then: { $size: "$$row.likes" }, else: 0 }
                        }
                    }
                }
            }
        }
    },{ $lookup: { from: "users", localField: "alternativeText.author", 
        foreignField: "_id", as: "authorAlternative" }
    },{ $addFields : {
            alternativeText: {
                $filter: {
                    input: "$alternativeText",
                    as: "alternativeText",
                    cond: {
                        $or: [
                            { $eq: ["$$alternativeText.isPublic", true] },
                            { $eq: ["$$alternativeText.author", ObjectId("5ca1127075a3b9210591d556")] }
                        ]
                    }
                }
            }
        }
    },{ $addFields : {
            alternativeText: {
                $map: {
                    input: "$alternativeText",
                    as: "row",
                    in: {
                        _id: "$$row._id",
                        isPublic: "$$row.isPublic",
                        title: "$$row.title",
                        liked: "$$row.liked",
                        likes: "$$row.likes",
                        author: "$$row.author",
                        authorIndex: { $indexOfArray: [ "$authorAlternative._id", "$$row.author" ] }
                    }
                }
            }
        }
    },{ $addFields : {
            alternativeText: {
                $map: {
                    input: "$alternativeText",
                    as: "row",
                    in: {
                        _id: "$$row._id",
                        isPublic: "$$row.isPublic",
                        title: "$$row.title",
                        liked: "$$row.liked",
                        likes: "$$row.likes",
                        author: { $arrayElemAt: [ "$authorAlternative.name", "$$row.authorIndex" ] }
                    }
                }
            }
        }
    },{
        $project: { sharedWith: 0, __v: 0, status: 0,
            author: { _id: 0, password: 0, email: 0, __v: 0, passwordResetExpires: 0, passwordResetToken: 0 },
            authorAlternative: 0 } }])

*/