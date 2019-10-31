import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getHistory, addLike, removeLike } from '../manageHistory/mainActions'

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

    handleEdit = (e) => {
        const edit = !this.state.edit
        this.setState({ edit })
    }

    handleBack = (e) => {
        const back = !this.state.back
        this.setState({ back })
    }

    addAlternativeText = (e) => {
        const toastrConfirmOptions = {
            onOk: () => {
                const addAlternativeText = !this.state.addAlternativeText
                this.setState({addAlternativeText})
            },
            onCancel: () => {},
            okText: 'NOVO' , 
            cancelText: 'PROCURAR'
        }
        toastr.confirm('Deseja criar um novo enredo ou usar um já existente?', toastrConfirmOptions)
    }

    reloadHistory = ( idHistory, idAuthor ) => {
        this.props.getHistory( idHistory, idAuthor )
        this.setState({back: false})
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
            this.reloadHistory(history.historyMaster, auth._id)

        return (
            <TemplateHistory handleEdit={this.handleEdit}
                history={ { ...history, edit, auth } }
                handleBack={this.handleBack}
                reloadHistory={this.reloadHistory}
                addAlternativeText={this.addAlternativeText}
                addLike={this.props.addLike}
                removeLike={this.props.removeLike} />
        )
    }
}

const mapStateToProps = state => ({ auth: state.auth.user, narrativeText: state.narrativeText })
const mapDispatchToProps = dispatch => bindActionCreators({ getHistory, 
    addLike, removeLike }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ReadHistory)