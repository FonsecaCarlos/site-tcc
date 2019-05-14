import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getPublicHistorys, getMyHistorys, searchHistory } from '../../pages/manageHistory/mainActions'
import { logout } from '../../pages/login/authActions'

import SearchImg from '../../images/search.png'
import AddImg from '../../images/add.png'

import './style.css'

class HeaderMain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: ''
        }
    }

    pesquisar = () => {
        if (this.state.search==='') return

        const { searchHistory, id } = this.props
        const title = this.state.search
        searchHistory(id, title)
        
        this.setState({search: ''})
    }

    updateSearch = (e) => {
        if (e.keyCode===13)
            return this.pesquisar()

        const search = e.target.value
        this.setState({ search })
    }

    render() {
        const {name, id} = this.props
        return (
            <header className='header-main'>
                <h2 className='header'>{name}</h2>

                <div className='header header-historias'>
                    <div className='header-left'>
                        <input className='header-search' 
                            onKeyUp={(e) => this.updateSearch(e)}
                            onChange={(e) => this.updateSearch(e)}
                            placeholder='Pesquisar' value={this.state.search} readOnly={false}/>
                        <input type='image' src={SearchImg} alt='Pesquisar' width='20'
                            onClick={() => this.pesquisar()} />
                    </div>
                    <div className='header-left header-buttons'>
                        <button className='header-button'
                            onClick={() => (this.props.getPublicHistorys(id))}>
                            Histórias públicas
                        </button>
                        {/*<button className='header-button'>Histórias compartilhadas</button>*/}
                        <button className='header-button'
                            onClick={() => (this.props.getMyHistorys(id))}>
                            Minhas histórias
                        </button>

                        <button className='header-button'
                            onClick={() => (this.props.logout())}>
                            Sair
                        </button>

                        <Link to={{
                            pathname: '/createHistory',
                            state: { create: true }
                        }}>
                            <img src={AddImg} alt='Adicionar história' width='20'
                                height='20' className='header-button' />
                        </Link>
                    </div>
                </div>
            </header>
        )
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    getPublicHistorys,
    getMyHistorys,
    searchHistory,
    logout
}, dispatch)

export default connect(null, mapDispatchToProps)(HeaderMain)