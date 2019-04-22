import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import api from '../../services/api'
import HeaderMain from '../../components/headerMain'
import CardMain from '../../components/cardMain'
import './style.css'

class MainHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {
            idHistory: null,
            redirect: false,
            historys: [],
            historysInfo: {},
            page: 1
        }
    }

    componentDidMount() {
        this.loadHistorys()
    }

    loadHistorys = async (page = 1) => {
        const response = await api.get(`/narrativeText/index?page=${page}`)
        const { docs, ...historysInfo } = response.data
        this.setState({ historys: docs, historysInfo, page })
    }

    prevPage = () => {
        const { page } = this.state
        if (page === 1) return

        const pageNumber = page - 1
        this.loadHistorys(pageNumber)
    }

    nextPage = () => {
        const { page, historysInfo } = this.state
        if (page === historysInfo.pages) return

        const pageNumber = page + 1
        this.loadHistorys(pageNumber)
    }

    handleClickHistory = (idHistory) => {
        this.setState({ redirect: true, idHistory })
    }

    render() {
        const { historys, page, historysInfo, redirect, idHistory } = this.state

        if (redirect)
            return <Redirect push to={{
                pathname: "/narrativeText",
                state: { idHistory }
            }} />

        return (
            <div className='main-wrapper'>
                <HeaderMain name={'Carlos Fonseca'} email={'carlos.fonseca@novaandradina.org'} />
                <div className='main-cards'>
                    {historys.map(history => (
                        <CardMain key={history._id}
                            title={history.title}
                            author={history.author}
                            text={history.text.substring(0, 200)}
                            createdAt={history.createdAt}
                            click={() => this.handleClickHistory(history._id)} />
                    ))}
                </div>

                <div className='actions'>
                    <button disabled={page === 1} onClick={this.prevPage}>Anterior</button>
                    <button disabled={page === historysInfo.pages} onClick={this.nextPage}>Próximo</button>
                </div>
            </div>
        )
    }
}

export default MainHistory