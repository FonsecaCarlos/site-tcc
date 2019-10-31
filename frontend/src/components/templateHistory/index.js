import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

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

export default class Template extends Component {
    constructor(props){
        super(props)
        this.state = {
            home: false
        }
    }

    handleHome = () => {
        this.setState({ home: !this.state.home })
    }

    render(){
        const { _id, edit, isAuthor, title, author, isPublic, text,
            isModifed, alternativeText, auth, historyMaster, likes, liked } = this.props.history
        const { home } = this.state
        
        if(home)
            return(
                <Redirect to='/'/>
            )
        
        return (
            <div className='read-wrapper'>
                <div className='read-header'>
                    <div>
                        <h2 className='item-read-header'>Título: {title}</h2>
                        <p className='item-read-header'>Autor: {author.name}</p>
                    </div>
    
                    <div className='read-header-rigth'>
    
                        { edit ? null :
                            <img src={homeImage}
                                className='icone-read-wrapper'
                                alt='Home'
                                title='Início'
                                onClick={ this.handleHome } />
                        }
                        
    
                        { edit ? null :
                        <span className='icone-read-wrapper-custom'>
                            {likes}
                            <img src={liked ? likedImage : likeImage}
                                className='icone-read-wrapper'
                                alt={liked ? 'Descurtir' : 'Curtir'}
                                onClick={liked ?
                                    () => this.props.removeLike(_id, auth._id) :
                                    () => this.props.addLike(_id, auth._id) 
                                }
                                title={liked ? 'Descurtir' : 'Curtir'} />
                        </span>
                        }
    
                        { historyMaster || edit ?
                            <img src={backImage}
                                className='icone-read-wrapper'
                                alt='Voltar'
                                onClick={this.props.handleBack}
                                title='Voltar' /> :
                            null
                        }
    
                        {edit ?
                            <div>
                                <img src={isPublic ? unlockImage : lockImage}
                                    className='icone-read-wrapper'
                                    alt='Editar História'
                                    onClick={this.props.handleIsPublic}
                                    title={`Torna história ${isPublic ? 'privada' : 'pública'}`} />
                                { isAuthor && (alternativeText.length===0) ?
                                    <img src={deleteImage} className='icone-read-wrapper'
                                        alt='Deletar História' onClick={() => this.props.deleteHistory(_id, auth._id)}
                                        title='Deletar história' />
                                    :
                                    ''
                                }
                            </div>
                            :
                            <div>
                                <img src={addImage}
                                    className='icone-read-wrapper'
                                    alt='Adicionar enredo alternativo'
                                    onClick={this.props.addAlternativeText}
                                    title='Adicionar enredo alternativo' />
                                { isAuthor ?
                                    <img src={editImage} className='icone-read-wrapper'
                                        alt='Editar História' onClick={this.props.handleEdit}
                                        title='Editar história' />
                                    :
                                    ''
                                }
                            </div>
                        }
                    </div>
                </div>
    
                {edit ?
                    <Editor value={text}
                        onTextChange={this.props.handleEditor} /> :
                    <div>
                        <div className='read-box' dangerouslySetInnerHTML={{ __html: text }}></div>
    
                        <div className='read-header-alternativeText'>
                            {alternativeText.map( alternativeText => 
                                <AlternativeLink key={alternativeText._id}
                                    alternativeText={alternativeText}
                                    onClick={() => this.props.reloadHistory(alternativeText._id, auth._id)} />
                                )
                            }
                        </div>
                    </div>
                }
    
                {edit ?
                    <div className='read-header-actions'>
                        <ButtonCustom label='Adicionar link para enredo alternativo'
                            onClick={this.props.addAlternativeText} />
                        {isModifed ? <ButtonCustom label='Finalizar'
                            onClick={this.props.save} /> : ''}
                    </div> : null
                }
    
            </div>
        )
    }
}