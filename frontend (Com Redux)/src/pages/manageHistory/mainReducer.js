const INITIAL_STATE = { 
    history: {
        _id: '',
        text: '',
        author: {
            name:''
        },
        alternativeText: []
    },
    historys: {
        data:[]
    },
    method: 'getPublicHistorys',
    created: false,
    search: ''
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'PUBLIC_HISTORYS_FETCHED':
            return { ...state, method: 'getPublicHistorys', 
                historys: action.payload.data }
        case 'MY_HISTORYS_FETCHED':
            return { ...state, method: 'getMyHistorys', 
                historys: action.payload.data }
        case 'HISTORY_FETCHED':
            return { ...state,
                history: action.payload.data.data[0] }
        case 'HISTORYS_SEARCHED':
            return { ...state, method: 'searchHistory',
                historys: action.payload.data }
        case 'SET_CREATED':
            return { ...state, created: action.payload }
        case 'SET_LIKE':
            return { ...state, history: { ...state.history, ...action.payload} }
        case 'SEARCH':
            return { ...state, search: action.payload }
        default:
            return state
    }
}