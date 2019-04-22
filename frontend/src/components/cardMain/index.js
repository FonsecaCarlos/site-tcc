import React from 'react'

import './style.css'

const cardMain = (props) => {
    return ( 
        <div className='box-card'
        onClick={props.click}>
            <div className='row-card'>
                <p><strong>Titulo: </strong>{props.title}</p>
            </div>
            <div className='row-card'>
                <p><strong>Autor: </strong>{props.author}</p>
            </div>
            <div className='row-card'>
                <p><strong>História: </strong>{props.text}</p>
            </div>
            <div className='row-card'>
                <p><strong>Criado em: </strong>{props.createdAt}</p>
            </div>
        </div>
     )
}
 
export default cardMain