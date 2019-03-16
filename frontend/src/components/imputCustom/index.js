import React, { Component } from 'react';
import PubSub from 'pubsub-js';

class InputCustom extends Component{

    constructor(){
        super();
        this.state = {msgErro:''};
    }

    componentDidMount() {
        PubSub.subscribe("erro-validacao",function(topico,erro){
            if(erro.field === this.props.name){
                this.setState({msgErro:erro.defaultMessage});
            }
        }.bind(this));
        
        PubSub.subscribe("limpa-erros",function(topico){
            this.setState({msgErro:''});
        }.bind(this));
    };

    render(){
        return(
            <div className="">
                <input {...this.props} />
                <span className="erro">{this.state.msgErro}</span>
            </div>
        );
    }
}

export default InputCustom;