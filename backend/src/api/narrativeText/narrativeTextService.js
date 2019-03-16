const NarrativeText = require('./narrativeText')
const errorHandler = require('../common/errorHandler')

NarrativeText.methods(['get', 'post', 'put', 'delete'])
NarrativeText.updateOptions({new: true, runValidators: true})
NarrativeText.after('post', errorHandler).after('put', errorHandler)

module.exports = NarrativeText