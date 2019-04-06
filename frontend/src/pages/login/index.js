import React, { Component } from 'react'

import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { login, signup } from './authActions'

import InputCustom from '../../components/inputCustom'
import HeaderLogin from '../../components/headerLogin'

import './style.css'

class Login extends Component {
    constructor() {
        super()
        this.state = { loginMode: true }
    }

    changeMode() {
        this.setState({ loginMode: !this.state.loginMode })
    }

    onSubmit(values) {
        const { login, signup } = this.props
        this.state.loginMode ? login(values) : signup(values)
    }

    render() {
        const { loginMode } = this.state
        const { handleSubmit } = this.props
        return (
            <div className="login-wrapper">
                <div>
                    <div className='login-header'>
                        <HeaderLogin />
                    </div>
                    <div className="login-form">
                        <form onSubmit={handleSubmit(v => this.onSubmit(v))}>
                            <Field component={InputCustom} type="input" name="name" placeholder="Nome" hide={loginMode} />
                            <Field component={InputCustom} type="email" name="email" placeholder="E-mail" />
                            <Field component={InputCustom} type="password" name="password" placeholder="Senha" />
                            <Field component={InputCustom} type="password" name="confirm_password" placeholder="Confirmar Senha" hide={loginMode} />

                            <a href='#' onClick={() => this.changeMode()}>
                                {loginMode ? 'Novo usuário? Registrar aqui!' :
                                    'Já é cadastrado? Entrar aqui!'}
                            </a>

                            <button type="submit" className="button-form">
                                {loginMode ? 'Entrar' : 'Registrar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Login = reduxForm({ form: 'authForm' })(Login)
const mapDispatchToProps = dispatch => bindActionCreators({ login, signup }, dispatch)
export default connect(null, mapDispatchToProps)(Login)