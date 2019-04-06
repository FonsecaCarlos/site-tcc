import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as toastrReducer } from 'react-redux-toastr'

//import DasboardReducer from '../dashboard/dashboardReducer'
//import TabReducer from '../common/tab/tabReducer'
//import BillingCycleReducer from '../billingCycle/billingCycleReducer'
import AuthReducer from '../pages/login/authReducer'

const rootReducer = combineReducers({
    //dashboard: DasboardReducer,
    //tab: TabReducer,
    //billingCycle: BillingCycleReducer,
    form: formReducer,
    toastr: toastrReducer,
    auth: AuthReducer
})

export default rootReducer