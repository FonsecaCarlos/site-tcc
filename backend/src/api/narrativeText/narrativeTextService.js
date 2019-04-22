const NarrativeText = require('./narrativeText')
const errorHandler = require('../common/errorHandler')

NarrativeText.methods(['get', 'post', 'put', 'delete'])
NarrativeText.updateOptions({new: true, runValidators: true})
NarrativeText.after('post', errorHandler).after('put', errorHandler)

const index = (req, res, next) => {
    const { page=1 } = req.query
    NarrativeText.paginate({}, { page, limit:12 })
        .then((narrativeText) => {
            return res.json(narrativeText)
        })
        .catch((errors) => {
            return res.json(errors)
        })
}

NarrativeText.route('index', ['get'], index)

module.exports = NarrativeText