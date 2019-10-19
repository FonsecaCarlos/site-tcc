import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getPublicHistorys, getMyHistorys } from '../../pages/manageHistory/mainActions'
import { logout } from '../../pages/login/authActions'

import SearchImg from '../../images/search.png'
import AddImg from '../../images/add.png'

import './style.css'

class HeaderMain extends Component {

    pesquisar = () => {
        const { searchHistory, id } = this.props
        searchHistory(id)
    }

    render() {
        const {name, search, id, method} = this.props
        
        return (
            <header id='topo' className='header-main'>
                <h2 className='header'>{name}</h2>

                <div className='header header-historias'>
                    <div className='header-left'>
                        <input className='header-search' 
                            onKeyUp={(e) => this.props.updateSearch(e, id)}
                            onChange={(e) => this.props.updateSearch(e, id)}
                            placeholder='Pesquisar' value={search} readOnly={false}/>
                        <input type='image' src={SearchImg} alt='Pesquisar' width='20'
                            onClick={() => this.props.pesquisar(id)}
                            title='Pesquisar' />
                    </div>
                    <div className={`header-left header-buttons`}>
                        <button className={`header-button ${method==='getPublicHistorys'?
                            'active':'desactive'}`}
                            onClick={() => {
                                    this.props.getPublicHistorys(1, id)
                                    this.props.clearSearch()
                                    this.props.initPage()
                                }
                            }>
                            Histórias públicas
                        </button>
                        <button className={`header-button ${method==='getMyHistorys'?
                            'active':'desactive'}`}
                            onClick={() => {
                                   this.props.getMyHistorys(1, id)
                                   this.props.clearSearch()
                                   this.props.initPage()
                                }
                            }>
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
                            <img src={AddImg} alt='Criar história' width='20'
                                height='20' className='header-button' 
                                title='Criar história'/>
                        </Link>
                    </div>
                </div>
            </header>
        )
    }
}

const mapStateToProps = state => ({ method: state.narrativeText.method })
const mapDispatchToProps = dispatch => bindActionCreators({
    getPublicHistorys,
    getMyHistorys,
    logout
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMain)