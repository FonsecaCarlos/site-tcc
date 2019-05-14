import React, { Component } from 'react'

import { Link, Redirect } from 'react-router-dom'
import InputCustom from '../../components/inputCustom'
import Author from '../../services/authorFromLocalStorage'
import api from '../../services/api'

import './style.css'

class CreareHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            _id: '',
            created: false,
            idHistory: this.props.location.state._id
        }
    }

    handleChange = (e) => {
        e.preventDefault()
        const title = e.target.value
        this.setState({ title })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const author = Author()._id
        const {title, idHistory} = this.state
        if(idHistory){
            const narrativeText = { author, title }
            this.createAlternativeText(narrativeText, idHistory)
        }else{
            const narrativeText = { author, title }
            this.createHistory(narrativeText)
        }
    }

    createAlternativeText = async ( narrativeText, idHistory ) => {
        api.post(`/narrativeText/addAlternativeText`, {narrativeText, idHistory} )
        .then((resp) => {
            const _id = resp.data._id
            this.setState({_id, created: true}) 
        })
        .catch((error) => console.log(error))
    }

    createHistory = async ( narrativeText ) => {
        api.post(`/narrativeText`, narrativeText )
        .then((resp) => this.setState({_id: resp.data._id, created: true}) )
        .catch((error) => console.log(error))
    }

    render() {
        const { created, _id, idHistory } = this.state
        
        if (created)
            return <Redirect push to={{
                pathname: "/writehistory",
                state: { _id }
            }} />
        

        return (
            <div className="create-history-wrapper">
                <div>
                    <div className='create-history-header'>
                        { idHistory ? <h1>Criar Enredo Alternativo</h1> : 
                            <h1>Criar História</h1> }
                    </div>
                    <div className="create-history-form">
                        <form onSubmit={this.handleSubmit}>

                            <InputCustom onChange={this.handleChange} 
                                type="input"
                                placeholder="Titulo" />

                            <div className='create-history-box-button-form'>
                                <Link to={'/'} className="create-history-button-form bt-danger">
                                    Cancelar
                                </Link>

                                <button type="submit" className="create-history-button-form">
                                    Criar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreareHistory