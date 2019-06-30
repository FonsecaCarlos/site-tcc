import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getHistory, addLike, removeLike, deleteHistory } from '../manageHistory/mainActions'

import TemplateHistory from '../../components/templateHistory'

class ReadHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            home: false,
            edit: false,
            back: false,
            addAlternativeText: false
        }
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

    reloadHistory = ( idHistory, idAuthor ) => {
        this.props.getHistory( idHistory, idAuthor )
        this.setState({back: false})
    }

    deleteHistory = ( idHistory, idAuthor ) => {
        this.props.deleteHistory( idHistory, idAuthor )
        this.setState({home: true})
    }

    render() {
        const { edit, back, home, addAlternativeText } = this.state
        const { history } = this.props.narrativeText
        const { auth } = this.props

        if (addAlternativeText)
            return <Redirect to={{
                pathname: '/createHistory',
                state: {create: false}
            }} />

        if (edit)
            return <Redirect to='/writehistory' />

        if (home)
            return <Redirect to='/' />

        if (back)
            this.reloadHistory(history.historyMaster, auth._id)

        return (
            <TemplateHistory handleEdit={this.handleEdit}
                history={ { ...history, edit, auth } }
                handleBack={this.handleBack}
                reloadHistory={this.reloadHistory}
                addAlternativeText={this.addAlternativeText}
                addLike={this.props.addLike}
                removeLike={this.props.removeLike}
                deleteHistory={this.deleteHistory} />
        )
    }
}

const mapStateToProps = state => ({ auth: state.auth.user, narrativeText: state.narrativeText })
const mapDispatchToProps = dispatch => bindActionCreators({ getHistory, 
    addLike, removeLike, deleteHistory }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ReadHistory)