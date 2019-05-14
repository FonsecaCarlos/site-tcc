const NarrativeText = require('./narrativeText')
const errorHandler = require('../common/errorHandler')

const restful = require('node-restful')
const mongoose = restful.mongoose
const ObjectId = mongoose.Types.ObjectId

NarrativeText.methods(['get', 'post', 'put', 'delete'])
NarrativeText.updateOptions({ new: true, runValidators: true })
NarrativeText.after('post', errorHandler).after('put', errorHandler)

//index - rota de paginação => são retornados todas as 
//historias de um determinado author
const index = (req, res, next) => {
    const { page = 1, idAuthor = "" } = req.query
    const id = new ObjectId(idAuthor)

    const aggregate = NarrativeText.aggregate()
    aggregate.lookup({
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
    }).unwind("author")
    .match({"author._id": id})
    .project({
        alternativeText: 0,
        sharedWith: 0,
        __v: 0,
        status: 0,
        author: { password: 0, email: 0, __v: 0 }
    }).sort({createdAt: -1})

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
    const aggregate = NarrativeText.aggregate()
    aggregate.lookup({
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
    }).unwind("author")
    .project({
        alternativeText: 0,
        sharedWith: 0,
        __v: 0,
        status: 0,
        author: { password: 0, email: 0, __v: 0 }
    })
    .match({ "isPublic": true })
    .match({"isMaster": true})
    .sort({createdAt: -1})

    const { page = 1 } = req.query
    NarrativeText.aggregatePaginate(aggregate, { page, limit: 12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

//indexHistory - rota get => retorna uma historia com o name e id do author
const indexHistory = (req, res, next) => {
    const { idHistory = "", idAuthor="" } = req.query
    const idHist = new ObjectId(idHistory)
    const idAuth = new ObjectId(idAuthor)

    const aggregate = NarrativeText.aggregate()
    aggregate.lookup({
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
    }).unwind("author")
    .match({"author._id": idAuth})
    .match({"_id": idHist})
    .project({
        sharedWith: 0,
        __v: 0,
        status: 0,
        author: { password: 0, email: 0, __v: 0 }
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

    const text = new NarrativeText( {...narrativeText, isMaster: false} )
    text.save()
        .then(data => {
            const { _id } = data
            NarrativeText.findByIdAndUpdate( id, { $push: {alternativeText: _id}} )
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
    const id = new ObjectId(idAuthor)
    
    const aggregate = NarrativeText.aggregate()
    aggregate.lookup({
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
    }).unwind("author")
    .match({"isPublic": true,
        //"author._id": id,
        "title": {$regex: title}})
    .project({
        alternativeText: 0,
        sharedWith: 0,
        __v: 0,
        status: 0,
        author: { password: 0, email: 0, _id: 0, __v: 0 }
    })
    .sort({createdAt: -1})
    
    const { page = 1 } = req.query
    NarrativeText.aggregatePaginate(aggregate, { page, limit: 12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
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