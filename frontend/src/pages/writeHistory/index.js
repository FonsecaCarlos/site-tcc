import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import api from '../../services/api'

import TemplateHistory from '../../components/templateHistory'

class WriteHistory extends Component {
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
            _id: null,
            edit: true,
            back: false,
            addAlternativeText: false,
            isModifed: false
         }
    }

    componentDidMount() {
        const { ...id } = this.props.location.state
        const idHistory = id['_id']
        this.loadHistory(idHistory)
        this.setState({isModifed: false})
    }

    loadHistory = async (id) => {
        const userKey = '_textNarrative_user'
        const authorJSON = localStorage.getItem(userKey)
        const author = JSON.parse(authorJSON)
        const response = await api.get(`/narrativeText/indexHistory?_id=${id}&author=${author._id}`)
        //tenho que pegar a history assim por conta do aggregatepaginate
        const history = response.data.data[0]
        this.setState({ isModifed: false, ...history })
    }

    handleEditor = (e) => {
        const textValue = e.htmlValue
        const text = textValue===null ? '' : textValue
        this.setState({ text, isModifed: true })
    }

    handleIsPublic = (e) => {
        const isPublic = !this.state.isPublic
        this.setState({isPublic})
    }

    handleBack = (e) => {
        const back = !this.state.back
        this.setState({back})
    }

    save = async () => {
        const { _id, text, isPublic} = this.state
        const resp = await api.put(`/narrativeText/${_id}`, { _id, text, isPublic})
        const history = resp.data
        this.loadHistory(history._id)
    }

    addAlternativeText = (e) => {
        const addAlternativeText = !this.state.addAlternativeText
        this.setState({addAlternativeText})
    }

    render() { 
        const { back, _id, addAlternativeText } = this.state

        if (addAlternativeText)
            return <Redirect push to={{
                pathname: "/createhistory",
                state: { _id }
            }} />

        if (back)
            return <Redirect push to={{
                pathname: "/readhistory",
                state: { _id }
            }} />

        return ( 
            <TemplateHistory handleBack={this.handleBack}
                handleEditor={this.handleEditor}
                handleIsPublic={this.handleIsPublic} 
                history={ this.state }
                save={this.save}
                addAlternativeText={this.addAlternativeText} />
         )
    }
}
 
export default WriteHistory