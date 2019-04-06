import React from 'react'

import { Switch, Route, Redirect } from 'react-router'

import mainHistory from '../pages/manageHistory/main'
//import BillingCycle from '../billingCycle/billingCycle'

export default props => (
    <div className='content-wrapper'>
        <Switch>
            <Route exact path='/' component={mainHistory} />
            {/*<Route path='billingCycles' component={BillingCycle} />*/}
            <Redirect from='*' to='/' />
        </Switch>
    </div>
)