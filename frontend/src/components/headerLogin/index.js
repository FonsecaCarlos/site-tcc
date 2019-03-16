import React, { Component } from 'react';

import img from '../../images/computer.png';

export default class HeaderLogin extends Component {

    render(){
        return(
            <header>
                <img src={ img }/>
                <p>"Dê asas à sua imaginação e materialize suas ideias criando narrativas em um click"</p>
            </header>
        );
    }
}