import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getPublicHistorys, getHistory, getMyHistorys, searchHistory, setSearch } from './mainActions'

import HeaderMain from '../../components/headerMain'
import CardMain from '../../components/cardMain'
import ButtonCustom from '../../components/buttonCustom'


import './style.css'

class MainHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            idHistory: '',
            redirect: false,
            page: 1
        }
    }

    initPage = () => {
        this.setState({page: 1})
    }

    clearSearch = () => {
        this.setState({ search: '' })
        setSearch('')
    }

    componentDidMount() {
        const { auth, narrativeText } = this.props
        const { method, search } = narrativeText
        
        this.setState({ search })
        const { page } = this.state
        
        this.props[method](page, auth._id, search)
    }

    handleClickHistory = (idHistory, idAuthor) => {
        this.props.getHistory(idHistory, idAuthor)
        this.setState({ redirect: true })
    }

    //codigo da internet
    redirectView = (elem) => {
        window.scroll({
            top: document.querySelector(elem),
            behavior: 'auto'// smooth - tem um animação
        });
    }

    prevPage = () => {
        const { page, search } = this.state
        if (page === 1) return

        const pageNumber = page - 1
        const { auth, narrativeText } = this.props
        const { method } = narrativeText
        this.props[method](pageNumber, auth._id, search)
        this.setState({ page: pageNumber })

        this.redirectView('topo')
    }

    nextPage = () => {
        const { page, search } = this.state
        const { pageCount } = this.props.narrativeText.historys
        if (page === pageCount) return

        const pageNumber = page + 1
        const { auth, narrativeText } = this.props
        const { method } = narrativeText
        this.props[method](pageNumber, auth._id, search)
        this.setState({ page: pageNumber })

        this.redirectView('topo')
    }

    pesquisar = (id) => {
        if (this.state.search === '') return

        const { searchHistory } = this.props
        const search = this.state.search
        searchHistory(1, id, search)
        this.initPage()
    }

    updateSearch = (e, id) => {
        const search = e.target.value

        if (e.keyCode === 13){
            return this.pesquisar(id)
        }

        this.props.setSearch(search)
        this.setState({search})
    }

    render() {
        const { redirect, page, search } = this.state
        const { auth, narrativeText } = this.props
        const { data, pageCount } = narrativeText.historys

        if (redirect)
            return <Redirect to='/readhistory' />

        return (
            <div className='main-wrapper'>
                <HeaderMain initPage={this.initPage}
                    searchHistory={this.searchHistory}
                    clearSearch={this.clearSearch}
                    pesquisar={this.pesquisar}
                    search={search}
                    updateSearch={this.updateSearch}
                    name={auth.name}
                    id={auth._id} />
                <div className='main-cards'>
                    {data.map(history => (
                        <CardMain key={history._id}
                            title={history.title}
                            author={history.author}
                            text={history.text}
                            createdAt={history.createdAt}
                            likes={history.likes}
                            liked={history.liked}
                            click={() => this.handleClickHistory(history._id, auth._id)} />
                    ))}
                </div>

                <div className='actions'>
                    <ButtonCustom disabled={page === 1}
                        className={page === 1 ? 'grey' : ''}
                        onClick={this.prevPage} label='Anterior' />
                    <ButtonCustom disabled={page === pageCount}
                        className={page === pageCount ? 'grey' : ''}
                        onClick={this.nextPage} label='Próximo' />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth.user,
    narrativeText: state.narrativeText
})
const mapDispatchToProps = dispatch => bindActionCreators({
    getPublicHistorys,
    getHistory,
    getMyHistorys,
    searchHistory,
    setSearch
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(MainHistory)