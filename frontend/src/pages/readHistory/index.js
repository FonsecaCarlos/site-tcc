import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import api from '../../services/api'
import Author from '../../services/authorFromLocalStorage'

import TemplateHistory from '../../components/templateHistory'

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
            _id: null,
            edit: false,
            back: false,
            addAlternativeText: false
        }
    }

    componentDidMount() {
        const { ...id } = this.props.location.state
        const idHistory = id['_id']
        this.loadHistory(idHistory)
    }

    loadHistory = async (id) => {
        const author = Author()
        const response = await api.get(`/narrativeText/indexHistory?_id=${id}&author=${author._id}`)
        //tenho que pegar a history assim por conta do aggregatepaginate
        const history = response.data.data[0]
        this.setState({ ...history })
    }

    handleEditor = (e) => {
        this.setState({ text: e.htmlValue })
    }

    handleIsPublic = (e) => {
        const isPublic = !this.state.isPublic
        this.setState({ isPublic })
    }

    handleEdit = (e) => {
        const edit = !this.state.edit
        this.setState({ edit })
    }

    handleBack = (e) => {
        const back = !this.state.back
        this.setState({ back })
    }

    reloadHistory = (id) => {
        this.loadHistory(id)
    }

    addAlternativeText = (e) => {
        const addAlternativeText = !this.state.addAlternativeText
        this.setState({addAlternativeText})
    }

    render() {
        const { edit, _id, back, addAlternativeText } = this.state

        if (addAlternativeText)
            return <Redirect push to={{
                pathname: "/createhistory",
                state: { _id }
            }} />

        if (edit)
            return <Redirect push to={{
                pathname: "/writehistory",
                state: { _id }
            }} />

        if (back)
            return <Redirect push to={{
                pathname: "/",
                state: { _id }
            }} />

        return (
            <TemplateHistory handleEdit={this.handleEdit}
                history={this.state}
                handleBack={this.handleBack}
                reloadHistory={this.reloadHistory}
                addAlternativeText={this.addAlternativeText} />
        )
    }
}

export default ReadHistory