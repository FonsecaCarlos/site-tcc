import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { actions as toastrActions } from 'react-redux-toastr'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getHistory, addLike, removeLike, getMyAlternativeText } from '../manageHistory/mainActions'
import AlternativeText from '../../components/alternativeText'
import TemplateHistory from '../../components/templateHistory'

class ReadHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            back: false,
            addAlternativeText: false
        }
        this.props.getMyAlternativeText(1, this.props.auth._id)
    }

    handleEdit = (e) => {
        const edit = !this.state.edit
        this.setState({ edit })
    }

    handleBack = (e) => {
        const back = !this.state.back
        this.setState({ back })
    }

    addAlternativeText = () => {
        const { auth } = this.props
        const { history, alternativesTexts } = this.props.narrativeText
        let count = 1
        this.props.getMyAlternativeText(count, auth._id)
        
        const toastrConfirmOptions = {
            onOk: () => {
                const addAlternativeText = !this.state.addAlternativeText
                this.setState({ addAlternativeText })
            },
            onCancel: () => {
                const toastr2 = bindActionCreators(toastrActions, this.props.dispatch)
                
                const toastrConfirmOptionsTwo = {
                    id: 'idToastr',
                    okText: 'CANCELAR',
                    cancelText: 'PRÓXIMO',
                    disableCancel: count >= alternativesTexts.pageCount ? true : false,
                    onCancel: () => {
                        if(count < alternativesTexts.pageCount){
                            this.props.getMyAlternativeText(++count, auth._id)
                            toastr.confirm('Escolha um de seus textos:', { ...toastrConfirmOptionsTwo, 
                                disableCancel: count >= alternativesTexts.pageCount ? true : false})
                        }
                    },
                    component: () => {
                        return <AlternativeText history={history}
                            update={() => {
                                toastr2.hideConfirm()
                            }} />
                    }
                }
                toastr.confirm('Escolha um de seus textos:', toastrConfirmOptionsTwo)
            },
            okText: 'NOVO',
            cancelText: 'PROCURAR'
        }
        toastr.confirm('Deseja criar um novo enredo ou usar um já existente?', toastrConfirmOptions)
    }

    reloadHistory = (idHistory, idAuthor) => {
        this.props.getHistory(idHistory, idAuthor)
        this.setState({ back: false })
    }

    render() {
        const { edit, back, addAlternativeText } = this.state
        const { history } = this.props.narrativeText
        const { auth } = this.props

        if (addAlternativeText)
            return <Redirect to={{
                pathname: '/createHistory',
                state: { create: false }
            }} />

        if (edit)
            return <Redirect to='/writehistory' />

        if (back)
            this.reloadHistory(history.historyMaster, auth._id)

        return (
            <TemplateHistory handleEdit={this.handleEdit}
                history={{ ...history, edit, auth }}
                handleBack={this.handleBack}
                reloadHistory={this.reloadHistory}
                addAlternativeText={this.addAlternativeText}
                addLike={this.props.addLike}
                removeLike={this.props.removeLike} />
        )
    }
}

const mapStateToProps = state => ({ auth: state.auth.user, narrativeText: state.narrativeText })
const mapDispatchToProps = dispatch => bindActionCreators({
    getHistory, addLike, removeLike, getMyAlternativeText, dispatch
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(ReadHistory)