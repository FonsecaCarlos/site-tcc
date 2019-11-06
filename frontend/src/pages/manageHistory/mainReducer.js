import consts from '../../consts'

const INITIAL_STATE = {
    history: {
        _id: '',
        text: '',
        author: {
            name: ''
        },
        alternativeText: []
    },
    historys: {
        data: []
    },
    alternativesTexts: {
        data: [],
        pageCount: 1
    },
    method: consts.GET_PUBLIC_HISTORYS,
    created: false,
    search: ''
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case consts.PUBLIC_HISTORYS_FETCHED:
            return {
                ...state, method: consts.GET_PUBLIC_HISTORYS,
                historys: action.payload.data
            }
        case consts.MY_HISTORYS_FETCHED:
            return {
                ...state, method: consts.GET_MY_HISTORYS,
                historys: action.payload.data
            }
        case consts.HISTORY_FETCHED:
            return {
                ...state,
                history: action.payload.data.data[0]
            }
        case consts.HISTORYS_SEARCHED:
            return {
                ...state, method: consts.SEARCH_HISTORY,
                historys: action.payload.data
            }
        case consts.SET_CREATED:
            return { ...state, created: action.payload }
        case consts.SET_LIKE:
            return { ...state, history: { ...state.history, ...action.payload } }
        case consts.SEARCH:
            return { ...state, search: action.payload }
        case consts.MY_ALTERNATIVE_TEXT_FETCHED:
            return { ...state, alternativesTexts: action.payload.data }
        default:
            return state
    }
}