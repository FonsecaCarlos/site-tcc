const INITIAL_STATE = { 
    history: {
        _id: '',
        author: {
            name:''
        },
        alternativeText: []
    },
    historys: {
        data:[]
    },
    method: 'getPublicHistorys',
    created: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'PUBLIC_HISTORYS_FETCHED':
            return { ...state, method: 'getPublicHistorys', 
                historys: action.payload.data,
                created: false }
        case 'MY_HISTORYS_FETCHED':
            return { ...state, method: 'getMyHistorys', 
                historys: action.payload.data,
                created: false }
        case 'HISTORY_FETCHED':
            return { ...state, 
                history: action.payload.data.data[0]}
        case 'HISTORY_EDITED':
            return { ...state, history: action.payload.data }
        case 'HISTORYS_SEARCHED':
            return { ...state, historys: action.payload.data}
        case 'SET_CREATED':
            return { ...state, created: action.payload}
        default:
            return state
    }
}