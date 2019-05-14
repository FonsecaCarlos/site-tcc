import React from 'react'

import { Switch, Route, Redirect } from 'react-router'

import MainHistory from '../pages/manageHistory'
import ReadHistory from '../pages/readHistory'
import WriteHistory from '../pages/writeHistory'
import CreateHistory from '../pages/createHistory'

export default props => (
    <div className='content-wrapper'>
        <Switch>
            <Route exact path='/' component={MainHistory} />
            <Route path='/readhistory' component={ReadHistory} />
            <Route path='/writehistory' component={WriteHistory} />
            <Route path='/createhistory' component={CreateHistory} />
            <Redirect from='*' to='/' />
        </Switch>
    </div>
)