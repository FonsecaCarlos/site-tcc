import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'
import { postAlternativeText, postHistory, setCreated } from '../manageHistory/mainActions'

import { Link, Redirect } from 'react-router-dom'
import InputCustom from '../../components/inputCustom'

import './style.css'

class CreareHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            text: '',
            create: undefined
        }
    }

    componentDidMount() {
        const { create } = this.props.location.state
        this.setState({ create })
        this.props.setCreated(false)
    }

    handleChange = (e) => {
        e.preventDefault()
        const title = e.target.value
        this.setState({ title })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const { auth } = this.props
        const { title, create, text } = this.state
        
        if(title===''){
            toastr.error('Erro', 'Informe o título do texto!')
        }else{
            const narrativeText = { author: { ...auth }, title, text }
    
            if (create) {
                this.props.postHistory(narrativeText)
            } else {
                const idHistory = this.props.narrativeText.history._id
                this.props.postAlternativeText(idHistory, narrativeText)
            }
        }
    }

    render() {
        const { create } = this.state
        const { created } = this.props.narrativeText
        
        if (created)
            return <Redirect to='/writehistory' />

        return (
            <div className="create-history-wrapper">
                <div>
                    <div className='create-history-header'>
                        {create ? <h1>Criar História</h1> :
                            <h1>Criar Enredo Alternativo</h1>}
                    </div>
                    <div className="create-history-form">
                        <form onSubmit={this.handleSubmit}>

                            <InputCustom onChange={this.handleChange}
                                type="input"
                                placeholder={create ? 'Título' :
                                    'Texto para tomada de decisão'} />

                            <div className='create-history-box-button-form'>
                                <Link to={'/readhistory'} className="create-history-button-form bt-danger">
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

const mapStateToProps = state => ({ auth: state.auth.user, narrativeText: state.narrativeText })
const mapDispatchToProps = dispatch => bindActionCreators({
    postAlternativeText,
    postHistory,
    setCreated
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(CreareHistory)