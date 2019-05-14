import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getPublicHistorys, getHistory, getMyHistorys } from './mainActions'

import HeaderMain from '../../components/headerMain'
import CardMain from '../../components/cardMain'
import ButtonCustom from '../../components/buttonCustom'


import './style.css'

class MainHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            idHistory: '',
            redirect: false,
            page: 1
        }
    }

    componentDidMount() {
        const {auth, narrativeText} = this.props
        const { method } = narrativeText
        this.props[method]( auth._id )
    }

    handleClickHistory = (idAuthor, idHistory) => {
        this.props.getHistory(idHistory, idAuthor)
        this.setState({ redirect: true })
    }

    prevPage = () => {
        const { page } = this.state
        if (page === 1) return

        const pageNumber = page - 1
        const {auth, narrativeText} = this.props
        const { method } = narrativeText
        this.props[method](auth._id, pageNumber)
        this.setState({page: pageNumber})
    }

    nextPage = () => {
        const { page } = this.state
        const { pageCount } = this.props.narrativeText.historys
        if (page === pageCount) return

        const pageNumber = page + 1
        const {auth, narrativeText} = this.props
        const { method } = narrativeText
        this.props[method](auth._id, pageNumber)
        this.setState({page: pageNumber})
    }

    render() {
        const { redirect, page } = this.state
        const { auth, narrativeText } = this.props
        const { data, pageCount } = narrativeText.historys
        
        if (redirect)
            return <Redirect to='/readhistory' />

        return (
            <div className='main-wrapper'>
                <HeaderMain name={auth.name} id={auth._id}/>
                <div className='main-cards'>
                    {data.map(history => (
                        <CardMain key={history._id}
                            title={history.title}
                            author={history.author}
                            text={history.text}
                            createdAt={history.createdAt}
                            click={() => this.handleClickHistory(history.author._id, history._id)} />
                    ))}
                </div>

                <div className='actions'>
                    <ButtonCustom disabled={page === 1} 
                        className={ page === 1 ? 'grey' : '' }
                        onClick={this.prevPage} label='Anterior'/>
                    <ButtonCustom disabled={page === pageCount} 
                        className={ page === pageCount ? 'grey' : '' }
                        onClick={this.nextPage} label='Próximo'/>
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
    getMyHistorys
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(MainHistory)