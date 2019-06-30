import React from 'react'
import { Link } from 'react-router-dom'

import { Editor } from 'primereact/editor'
import ButtonCustom from '../buttonCustom'
import AlternativeLink from '../alternativeLink'

import addImage from '../../images/add-black.png'
import editImage from '../../images/edit.png'
import lockImage from '../../images/lock.png'
import unlockImage from '../../images/unlock.png'
import backImage from '../../images/back-arrow.png'
import homeImage from '../../images/home-icon-silhouette.png'
import likedImage from '../../images/liked.png'
import likeImage from '../../images/like.png'
import deleteImage from '../../images/rubbish-bin.png'

import './style.css'

export default (props) => {
    const { _id, edit, isAuthor, title, author, isPublic, text,
        isModifed, alternativeText, auth, historyMaster, likes, liked } = props.history

    return (
        <div className='read-wrapper'>
            <div className='read-header'>
                <div>
                    <h2 className='item-read-header'>Título: {title}</h2>
                    <p className='item-read-header'>Autor: {author.name}</p>
                </div>

                <div className='read-header-rigth'>

                    <Link to='/'>
                        <img src={homeImage}
                            className='icone-read-wrapper'
                            alt='Home'
                            title='Início' />
                    </Link>

                    { edit ? null :
                    <span className='icone-read-wrapper-custom'>
                        {likes}
                        <img src={liked ? likedImage : likeImage}
                            className='icone-read-wrapper'
                            alt={liked ? 'Descurtir' : 'Curtir'}
                            onClick={liked ?
                                () => props.removeLike(_id, auth._id) :
                                () => props.addLike(_id, auth._id) 
                            }
                            title={liked ? 'Descurtir' : 'Curtir'} />
                    </span>
                    }

                    {historyMaster ?
                        <img src={backImage}
                            className='icone-read-wrapper'
                            alt='Voltar'
                            onClick={props.handleBack}
                            title='Voltar' /> :
                        null
                    }

                    {edit ?
                        <img src={isPublic ? unlockImage : lockImage}
                            className='icone-read-wrapper'
                            alt='Editar História'
                            onClick={props.handleIsPublic}
                            title={`Torna história ${isPublic ? 'privada' : 'pública'}`} />
                        :
                        <div>
                            <img src={addImage}
                                className='icone-read-wrapper'
                                alt='Adicionar enredo alternativo'
                                onClick={props.addAlternativeText}
                                title='Adicionar enredo alternativo' />
                            {isAuthor ?
                                <img src={editImage} className='icone-read-wrapper'
                                    alt='Editar História' onClick={props.handleEdit}
                                    title='Editar história' />
                                :
                                ''
                            }
                            {isAuthor && (alternativeText.length===0) ?
                                <img src={deleteImage} className='icone-read-wrapper'
                                    alt='Deletar História' onClick={() => props.deleteHistory(_id, auth._id)}
                                    title='Deletar história' />
                                :
                                ''
                            }
                        </div>
                    }
                </div>
            </div>

            {edit ?
                <Editor value={text}
                    onTextChange={props.handleEditor} /> :
                <div>
                    <div className='read-box' dangerouslySetInnerHTML={{ __html: text }}></div>

                    <div className='read-header-alternativeText'>
                        {alternativeText.map( alternativeText => 
                            <AlternativeLink key={alternativeText._id}
                                alternativeText={alternativeText}
                                onClick={() => props.reloadHistory(alternativeText._id, auth._id)} />
                            )
                        }
                    </div>
                </div>
            }

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