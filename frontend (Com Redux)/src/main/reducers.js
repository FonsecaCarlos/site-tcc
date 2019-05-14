import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as toastrReducer } from 'react-redux-toastr'

import AuthReducer from '../pages/login/authReducer'
import MainReducer from '../pages/manageHistory/mainReducer'

const rootReducer = combineReducers({
    narrativeText: MainReducer,
    form: formReducer,
    toastr: toastrReducer,
    auth: AuthReducer
})

export default rootReducer