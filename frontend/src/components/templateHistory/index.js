import React from 'react'

import { Editor } from 'primereact/editor'
import ButtonCustom from '../buttonCustom'
import AlternativeLink from '../alternativeLink'

import addImage from '../../../src/images/add-black.png'
import editImage from '../../../src/images/edit.png'
import lockImage from '../../../src/images/lock.png'
import unlockImage from '../../../src/images/unlock.png'
import backImage from '../../../src/images/back-arrow.png'

import Author from '../../services/authorFromLocalStorage'

import './style.css'

export default (props) => {
    const { edit, title, author, isPublic, text, isModifed, alternativeText } = props.history
    const idAuthor = Author()._id
    
    return (
        <div className='read-wrapper'>
            <div className='read-header'>
                <div>
                    <h1 className='item-read-header'>Título: {title}</h1>
                    <p className='item-read-header'>Autor: {author.name}</p>
                </div>

                <div className='read-header-rigth'>

                    <img src={backImage}
                        className='icone-read-wrapper'
                        alt='Voltar'
                        onClick={props.handleBack} />

                    { edit ?
                        <img src={isPublic ? unlockImage : lockImage}
                            className='icone-read-wrapper'
                            alt='Editar História'
                            onClick={props.handleIsPublic} />
                        :
                        <div>
                            <img src={addImage} 
                                className='icone-read-wrapper' 
                                alt='Adicionar enredo alternativo'
                                onClick={props.addAlternativeText} />
                            { idAuthor===author._id ?
                                <img src={editImage} className='icone-read-wrapper'
                                    alt='Editar História' onClick={props.handleEdit} />
                                :
                                ''
                            }
                        </div>
                    }
                </div>
            </div>

            <Editor value={text}
                onTextChange={props.handleEditor}
                readOnly={!edit} />

            <div className='read-header-alternativeText'>
                {alternativeText.map((_id) => <AlternativeLink key={_id}
                    _id={_id}
                    className='read-header-alternativeLink'
                    onClick={() => props.reloadHistory(_id)} />)}
            </div>

            {edit ?
                <div className='read-header-actions'>
                    <ButtonCustom label='Adicionar link para enredo alternativo'
                        onClick={props.addAlternativeText} />
                    {isModifed ? <ButtonCustom label='Finalizar'
                        onClick={props.save} /> : ''}
                </div> : null
            }

        </div>
    )
}