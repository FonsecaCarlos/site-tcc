import React from 'react';

import img from '../../images/computer.png';
import './style.css'

export default props => (
    <header>
        <img src={img} className='icone-header' alt='Logo' />
        <p className='slogan'>"Dê asas à sua imaginação e materialize suas ideias criando narrativas em um click"</p>
    </header>
)