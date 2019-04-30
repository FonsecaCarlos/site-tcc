import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import api from '../../services/api'
import HeaderMain from '../../components/headerMain'
import CardMain from '../../components/cardMain'
import ButtonCustom from '../../components/buttonCustom'
import Author from '../../services/authorFromLocalStorage'

import './style.css'

class MainHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {
            idHistory: null,
            redirect: false,
            historys: [],
            historysInfo: {
                pageCount: 1
            },
            pageCount: 1,
            author: {}
        }
    }

    componentDidMount() {
        this.setAuthor()
        //this.loadHistorysPublics()
        this.loadMyHistorys( Author() )
    }

    setAuthor = () => {
        const userKey = '_textNarrative_user'
        const authorJSON = localStorage.getItem(userKey)
        const author = JSON.parse(authorJSON)
        this.setState({ author: author })
    }

    loadMyHistorys = async (author, pageCount = 1) => {
        const response = await api.get(`/narrativeText/index?page=${pageCount}&_id=${author._id}`)
        const { data, ...historysInfo  } = response.data
        this.setState({ historys: data, historysInfo, pageCount })
    }

    loadHistorysPublics = async (pageCount = 1) => {
        const response = await api.get(`/narrativeText/indexPublic?page=${pageCount}`)
        const { data, ...historysInfo } = response.data
        this.setState({ historys: data, historysInfo, pageCount })
    }

    prevPage = () => {
        const { pageCount } = this.state
        if (pageCount === 1) return

        const pageNumber = pageCount - 1
        this.loadMyHistorys( Author(), pageNumber)
    }

    nextPage = () => {
        const { pageCount, historysInfo } = this.state
        if (pageCount === historysInfo.pageCount) return

        const pageNumber = pageCount + 1
        this.loadMyHistorys( Author(), pageNumber)
    }

    handleClickHistory = (idHistory) => {
        this.setState({ redirect: true, idHistory })
    }

    render() {
        const { historys, pageCount, historysInfo, redirect, idHistory, author } = this.state
        
        if (redirect)
            return <Redirect push to={{
                pathname: "/readhistory",
                state: { _id: idHistory }
            }} />
        
        return (
            <div className='main-wrapper'>
                <HeaderMain name={author.name} publicHistory={this.loadHistorysPublics}/>
                
                <div className='main-cards'>
                    {historys.map(history => (
                        <CardMain key={history._id}
                            title={history.title}
                            author={history.author}
                            text={history.text}
                            createdAt={history.createdAt}
                            click={() => this.handleClickHistory(history._id)} />
                    ))}
                </div>
                
                <div className='actions'>
                    <ButtonCustom disabled={pageCount === 1} 
                        className={ pageCount === 1 ? 'grey' : '' }
                        onClick={this.prevPage} label='Anterior'/>
                    <ButtonCustom disabled={pageCount === historysInfo.pageCount} 
                        className={ pageCount === historysInfo.pageCount ? 'grey' : '' }
                        onClick={this.nextPage} label='Próximo'/>
                </div>
            </div>
        )
    }
}

export default MainHistory