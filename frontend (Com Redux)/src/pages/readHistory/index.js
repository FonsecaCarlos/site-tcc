import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getHistory } from '../manageHistory/mainActions'

import TemplateHistory from '../../components/templateHistory'

class ReadHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            back: false,
            addAlternativeText: false
        }
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

    addAlternativeText = (e) => {
        const addAlternativeText = !this.state.addAlternativeText
        this.setState({addAlternativeText})
    }

    reloadHistory = ( id ) => {
        const { auth } = this.props
        this.props.getHistory(id, auth._id)
    }

    render() {
        const { edit, back, addAlternativeText } = this.state
        const { history } = this.props.narrativeText
        const { auth } = this.props

        if (addAlternativeText)
            return <Redirect to={{
                pathname: '/createHistory',
                state: {create: false}
            }} />

        if (edit)
            return <Redirect to='/writehistory' />

        if (back)
            return <Redirect to='/'/>

        return (
            <TemplateHistory handleEdit={this.handleEdit}
                auth={ auth }
                history={ { ...history, edit} }
                handleBack={this.handleBack}
                reloadHistory={this.reloadHistory}
                addAlternativeText={this.addAlternativeText} />
        )
    }
}

const mapStateToProps = state => ({ auth: state.auth.user, narrativeText: state.narrativeText })
const mapDispatchToProps = dispatch => bindActionCreators({ getHistory }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ReadHistory)