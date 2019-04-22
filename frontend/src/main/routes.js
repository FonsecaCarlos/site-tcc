import React from 'react'

import { Switch, Route, Redirect } from 'react-router'

import mainHistory from '../pages/manageHistory'
import ReadHistory from '../pages/readHistory'

export default props => (
    <div className='content-wrapper'>
        <Switch>
            <Route exact path='/' component={mainHistory} />
            <Route path='/narrativeText' component={ReadHistory} />
            <Redirect from='*' to='/' />
        </Switch>
    </div>
)