import React from 'react'

import { textoParaData, dataParaTexto } from '../operator/dateHelper'
import './style.css'

const cardMain = (props) => {
    const date = textoParaData(props.createdAt)
    const dateFormated = dataParaTexto( date )
    //<p><strong>Autor(es): </strong>{props.author.map(author => (`${author.name} `))}</p>
    return ( 
        <div className='box-card'
        onClick={props.click}>
            <div className='row-card'>
                <p><strong>Titulo: </strong>{props.title}</p>
            </div>
            <div className='row-card'>
            
                <p><strong>Autor: </strong>{props.author.name}</p>
            </div>
            <div className='row-card'>
                <p><strong>História: </strong>{props.text.substring(0, 200)}</p>
            </div>
            <div className='row-card'>
                <p><strong>Criado em: </strong>{ dateFormated }</p>
            </div>
        </div>
     )
}
 
export default cardMain