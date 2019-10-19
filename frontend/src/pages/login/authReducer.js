import consts from '../../consts'

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem(consts.USER_KEY)),
    validToken: false,
    reset: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case consts.TOKEN_VALIDATED:
            if (action.payload) {
                return { ...state, validToken: true }
            } else {
                localStorage.removeItem(consts.USER_KEY)
                return { ...state, validToken: false, user: null }
            }
        case consts.USER_FETCHED:
            localStorage.setItem(consts.USER_KEY, JSON.stringify(action.payload))
            return { ...state, user: action.payload, validToken: true }
        case consts.USER_RESET:
            return { ...state, reset: action.payload }
        default:
            return state
    }
}