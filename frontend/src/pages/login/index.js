import React, { Component } from 'react';

import InputCustom from '../../components/imputCustom';

import ButtonCustom from '../../components/buttonCustom';

import HeaderLogin from '../../components/headerLogin';

import './style.css'

export default class Login extends Component {
    constructor(){
        super();
        this.state = {
          user:'',
          password:''
        };
    }

    saveChange(nomeInput,evento){
        this.setState({[nomeInput]:evento.target.value});
    }

    render(){
        return(
            <div className="login-wrapper">
                <div>
                    <div className='login-header'>
                        <HeaderLogin/>
                    </div>
                    <div className="login-form">
                        <form>                                          
                            <InputCustom id="user" type="text" name="user" value={this.state.user} onChange={this.saveChange.bind(this,'user')} placeholder="Usuário"/>                                              
                            <InputCustom id="password" type="password" name="password" value={this.state.password} onChange={this.saveChange.bind(this,'password')} placeholder="Senha"/>
                                                                    
                            <ButtonCustom label="Acessar"/>
                            <ButtonCustom label="Criar Conta"/>                                              
                        </form>
                    </div>
                </div>             
            </div>
        );
    }
}