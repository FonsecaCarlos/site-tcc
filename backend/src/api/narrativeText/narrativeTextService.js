const NarrativeText = require('./narrativeText')
const errorHandler = require('../common/errorHandler')

const restful = require('node-restful')
const mongoose = restful.mongoose
const ObjectId = mongoose.Types.ObjectId

NarrativeText.methods(['post'])
NarrativeText.updateOptions({ new: true, runValidators: true })
NarrativeText.after('post', errorHandler).after('put', errorHandler)

//index - rota de paginação => são retornados todas as 
//historias de um determinado author
const index = (req, res, next) => {
    const { page = 1, idAuthor = "" } = req.query
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
            "author._id": idAuth,
            //isMaster: true
        })
        .lookup({from: "narrativetexts",localField: "alternativeText",
            foreignField: "_id",as: "alternativeText"
        })
        .addFields({
            isAuthor: {
                $cond: [{ $eq: ["$author._id", idAuth] }, true, false]
            },
            liked: {
                $cond: {
                    if: { $isArray: "$likes" },
                    then: { $in: [ idAuth, "$likes" ] },
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
                        liked: {
                            $cond: {
                                if: { $isArray: "$$row.likes" },
                                then: { $in: [ idAuth, "$$row.likes" ] },
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
        })
        .project({
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: { _id: 0, password: 0, email: 0, __v: 0 }
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
//historias publicas e master
const indexPublic = (req, res, next) => {
    const { idAuthor } = req.query
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
        .lookup({from: "narrativetexts",localField: "alternativeText",
            foreignField: "_id",as: "alternativeText"
        })
        .addFields({
            isAuthor: {
                $cond: [{ $eq: ["$author._id", idAuth] }, true, false]
            },
            liked: {
                $cond: {
                    if: { $isArray: "$likes" },
                    then: { $in: [ idAuth, "$likes" ] },
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
                        liked: {
                            $cond: {
                                if: { $isArray: "$$row.likes" },
                                then: { $in: [ idAuth, "$$row.likes" ] },
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
        })
        .project({
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: { _id: 0, password: 0, email: 0, __v: 0 }
        })
        .sort({ createdAt: -1 })

    const { page = 1 } = req.query
    NarrativeText.aggregatePaginate(aggregate, { page, limit: 12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

//indexHistory - rota get => retorna uma historia com o name do author
//e é adicionado um campo isAuthor para saber é ele é o dono da historia
const indexHistory = (req, res, next) => {
    const { idHistory, idAuthor } = req.query
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
        .lookup({from: "narrativetexts",localField: "alternativeText",
            foreignField: "_id",as: "alternativeText"
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
                        liked: {
                            $cond: {
                                if: { $isArray: "$$row.likes" },
                                then: { $in: [ idAuth, "$$row.likes" ] },
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
        })
        .project({
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: { _id: 0, password: 0, email: 0, __v: 0 }
        })
    //procurar como substituir o metodo aggregatePaginate pelo find
    NarrativeText.aggregatePaginate(aggregate)
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

const addAlternativeText = (req, res, next) => {
    const { narrativeText, idHistory } = req.body
    const id = new ObjectId(idHistory)

    const text = new NarrativeText({ ...narrativeText, isMaster: false, historyMaster: id })
    text.save()
        .then(data => {
            const { _id } = data
            NarrativeText.findByIdAndUpdate(id, { $push: { alternativeText: _id } })
                .then(alternativeText => {
                    res.json(data)
                })
                .catch((errors) => {
                    return res.json(errors)
                })
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

//searchHistory - rota de paginação => são retornados todas as 
//historias publicas e todas do author com o titulo pesquisado
const searchHistory = (req, res, next) => {
    const { idAuthor, title } = req.query
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
            "title": { $regex: title }
        })
        .lookup({from: "narrativetexts",localField: "alternativeText",
            foreignField: "_id",as: "alternativeText"
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
                        liked: {
                            $cond: {
                                if: { $isArray: "$$row.likes" },
                                then: { $in: [ idAuth, "$$row.likes" ] },
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
        })
        .project({
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: { password: 0, email: 0, _id: 0, __v: 0 }
        })
        .sort({ createdAt: -1 })

    const { page = 1 } = req.query
    NarrativeText.aggregatePaginate(aggregate, { page, limit: 12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

const putHistory = (req, res, next) => {
    const { narrativeText, idAuthor } = req.body
    const { _id } = narrativeText
    NarrativeText.findById({ _id })
        .then(text => {
            const { author } = text
            if (`${author}` === idAuthor) {
                NarrativeText.findByIdAndUpdate({ _id }, { ...narrativeText })
                    .then(data => {
                        res.json(data)
                    })
                    .catch((errors) => {
                        return res.json(errors)
                    })
            } else {
                return res.status(500).json({ errors: ['Permisão negada!'] })
            }
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

const addLike = (req, res, next) => {
    const { idHistory, idAuthor } = req.query
    const id = new ObjectId(idHistory)
    const idAuth = new ObjectId(idAuthor)

    NarrativeText.findById(id)
        .then(data => {
            const exists = data.likes.indexOf(idAuth)
            if (exists === -1) {
                NarrativeText.findByIdAndUpdate(id, { $push: { likes: idAuth } })
                    .then(text => {
                        res.json({likes: text.likes.length+1, liked: true})
                    })
                    .catch((errors) => {
                        return res.json(errors)
                    })
            } else {
                res.status(500).json({ errors: ['Texto já curtido!'] })
            }
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

const removeLike = (req, res, next) => {
    const { idHistory, idAuthor } = req.query
    const id = new ObjectId(idHistory)
    const idAuth = new ObjectId(idAuthor)

    NarrativeText.findById(id)
        .then(data => {
            const exists = data.likes.indexOf(idAuth)
            if (exists !== -1) {
                NarrativeText.findByIdAndUpdate(id, { $pull: { likes: idAuth } })
                    .then(text => {
                        res.json({likes: text.likes.length-1, liked: false})
                    })
                    .catch((errors) => {
                        return res.json(errors)
                    })
            } else {
                res.status(500).json({ errors: ['Texto já descurtido!'] })
            }
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

const deleteHistory = (req, res, next) => {
    const { idHistory, idAuthor } = req.query
    const id = new ObjectId(idHistory)
    const idAuth = new ObjectId(idAuthor)

    NarrativeText.findById(id)
        .then(data => {
            const { author, historyMaster } = data
            if ((author==idAuthor) && (data.alternativeText.length===0)) {
                NarrativeText.findByIdAndUpdate(historyMaster, { $pull: { alternativeText: id } })
                    .then(text => {
                        NarrativeText.findByIdAndRemove(id)
                            .then(text => {
                                res.json({success:'Texto removido com sucesso'})
                            })
                            .catch((errors) => {
                                return res.json(errors)
                            })
                    })
                    .catch((errors) => {
                        return res.json(errors)
                    })
            } else if (author!=idAuthor){
                res.status(500).json({ errors: ['Permissão negada!'] })
            }else{
                res.status(500).json({ errors: ['Não é possível remover uma história com enredo alternativo!'] })
            }
        })
        .catch((errors) => {
            return res.json(errors)
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




/*NarrativeText.paginate({ isPublic: true }, { page, limit: 12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })*/

/*NarrativeText.paginate( {author}, { page, limit: 12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })*/
/*
db.getCollection('narrativetexts').aggregate([{ $lookup:{from: "users",localField: "author",
          foreignField: "_id",as: "author"}
   },{
        $unwind: "$author"
   },{
        $addFields: {
            isAuthor:{$cond:[{$eq:["$author._id",ObjectId("5ca10fd3fa684e1f0525e3ac")]},true, false ]}
        }
   },{
        $project: {
            alternativeText: 0,sharedWith: 0,__v: 0,status: 0,
            author: { password: 0, email: 0, __v: 0 }
        }
 }])
*/


//index - rota de paginação => são retornados todas as histórias públicas
//e todas as historias de um determinado author
/*const index = (req, res, next) => {
    const { page=1, author="" } = req.query
    NarrativeText.paginate({$or: [ {author}, {isPublic: true} ] }, { page, limit:12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

db.getCollection('narrativetexts').aggregate([{"$match":{"author":"5ca10fd3fa684e1f0525e3ac"}},
    {"$project":{"author":1,"title":1}}])

db.getCollection('narrativetexts').aggregate([{ $lookup:
        {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
   },{
        $unwind: "$author"
   },{
        $match: {
            "author._id": ObjectId("5ca1127075a3b9210591d556")
        }
   },{
        $project: {
            alternativeText: 0,
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: { password: 0, email: 0, _id: 0, __v: 0 }
        }
 }])

db.getCollection('narrativetexts').aggregate([{ $lookup:
        {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
   },{
        $project: {
            alternativeText: 0,
            sharedWith: 0,
            __v: 0,
            status: 0,
            author: { password: 0, email: 0, _id: 0, __v: 0 }
        }
    }
])
    */