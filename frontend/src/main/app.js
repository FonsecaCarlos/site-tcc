import React from 'react'

import { HashRouter } from 'react-router-dom'

import Messages from '../components/messages'

import Routes from './routes'

export default props => (
    <HashRouter>
        <div className='wrapper'>
            <Routes />
            <Messages />
        </div>
    </HashRouter>
)