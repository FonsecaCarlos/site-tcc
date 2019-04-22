import React, { Component } from 'react';

import api from '../../services/api'
import { Editor } from 'primereact/editor'

import add from '../../../src/images/add-black.png'
import edit from '../../../src/images/edit.png'
import lock from '../../../src/images/lock.png'
import unlock from '../../../src/images/unlock.png'

import './style.css'

class ReadHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alternativeText: [],
            author: '',
            createdAt: null,
            isPublic: true,
            status: '',
            text: '',
            title: '',
            _id: null
        }
    }

    componentDidMount() {
        const { ...id } = this.props.location.state
        const idHistory = id['idHistory']
        this.loadHistory(idHistory)
    }

    loadHistory = async (id) => {
        const response = await api.get(`/narrativeText/${id}`)
        const history = response.data
        this.setState({ ...history })
    }

    handleEditor = (e) => {
        this.setState({ text: e.htmlValue })
    }

    render() {
        const { title, author, text } = this.state
        return (
            <div className='read-wrapper'>
                <div className='read-header'>
                    <h1 className='item-read-header'>Título: {title}</h1>
                    <p className='item-read-header'>Autor: {author}</p>

                    <img src={add} className='icone-read-wrapper' alt='Adicionar enredo alternativo' />
                    <img src={edit} className='icone-read-wrapper' alt='Editar História' />
                    <img src={lock} className='icone-read-wrapper' alt='Editar História' />
                    <img src={unlock} className='icone-read-wrapper' alt='Editar História' />
                </div>

                <Editor value={text}
                    onTextChange={this.handleEditor} />

            </div>
        )
    }
}

export default ReadHistory