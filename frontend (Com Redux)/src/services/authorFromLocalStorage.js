export default () => {
    const userKey = '_textNarrative_user'
    const authorJSON = localStorage.getItem(userKey)
    const author = JSON.parse(authorJSON)
    return author
}

