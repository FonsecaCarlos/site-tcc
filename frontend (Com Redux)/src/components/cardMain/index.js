import React from 'react'

import { textoParaData, dataParaTexto } from '../operator/dateHelper'

import likedImage from '../../images/liked.png'
import likeImage from '../../images/like.png'

import './style.css'

const cardMain = (props) => {
    const date = textoParaData(props.createdAt)
    const dateFormated = dataParaTexto(date)
    
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
                <p dangerouslySetInnerHTML={{
                    __html: `<strong>História: </strong>${props.text.substring(0, 200)} ...`
                }}>
                </p>
            </div>

            <div className='row-card'>
                <div className='row-card-custom'>
                    <p><strong>Criado em: </strong>{dateFormated}</p>
                    <p>
                        <span>{props.likes}
                            <img src={props.liked ? likedImage : likeImage}
                                className='icone-row-card'
                                alt='Curtidas' />
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default cardMain