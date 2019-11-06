import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { toastr } from 'react-redux-toastr'
import { actions as toastrActions } from 'react-redux-toastr'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { putHistory, getHistory, setCreated, deleteHistory, getMyAlternativeText } from '../manageHistory/mainActions'
import AlternativeText from '../../components/alternativeText'
import TemplateHistory from '../../components/templateHistory'

class WriteHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            isPublic: true, 
            edit: true,
            back: false,
            addAlternativeText: false,
            isModifed: false,
            home: false
        }
        this.props.getMyAlternativeText(1, this.props.auth._id)
    }

    componentDidMount() {
        const { text, isPublic} = this.props.narrativeText.history
        this.setState({ text, isPublic})
        this.props.setCreated(false)
    }

    handleEditor = (e) => {
        const textValue = e.htmlValue
        const text = textValue===null ? '' : textValue
        this.setState({ text, isModifed: true })
    }

    handleIsPublic = (e) => {
        const { isPublic } = this.state
        const toastrConfirmOptions = {
            onOk: () => {
                this.setState({isPublic: !isPublic, isModifed: true})
            },
            onCancel: () => {},
            okText: isPublic ? 'TORNAR PRIVADA' : 'TORNAR PÚBLICA', 
            cancelText: 'CANCELAR'
        }
        if(!isPublic)
            toastr.confirm('Deseja tornar história pública? Todos poderão visualizá-la.',
                toastrConfirmOptions)
        else
            toastr.confirm('Deseja tornar história privada? Apenas você poderá visualizá-la.',
                toastrConfirmOptions)
    }

    handleBack = (e) => {
        const { isModifed } = this.state
        
        if(isModifed){
            toastr.error('Aviso', 'Salve as alterações')
            return
        }
        
        const back = !this.state.back
        this.setState({back})
    }

    save = async() => {
        const { text, isPublic } = this.state
        let { _id } = this.props.narrativeText.history
        const { auth } = this.props

        this.props.putHistory( auth._id, { _id, text, isPublic})
        
        this.setState({isModifed: false})
    }

    addAlternativeText = (e) => {
        const { isModifed } = this.state
        
        if(isModifed){
            toastr.error('Aviso', 'Salve as alterações')
            return
        }
        
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

    deleteHistory = ( idHistory, idAuthor ) => {
        const { historyMaster } = this.props.narrativeText.history
    
        const toastrConfirmOptions = {
            onOk: () => {
                this.props.deleteHistory( idHistory, idAuthor, historyMaster )
                
                if(historyMaster){
                    this.setState({back: true})
                }else{
                    /* Remover historia apagada da lista */
                    this.setState({home: true})
                }
            },
            onCancel: () => {},
            okText: 'REMOVER' , 
            cancelText: 'CANCELAR'
        }
        toastr.confirm('Deseja realmente remover a história?', toastrConfirmOptions)        
    }

    render() {
        const { back, addAlternativeText, text, edit, isPublic, isModifed, home } = this.state
        const { history } = this.props.narrativeText
        const { auth } = this.props

        if (addAlternativeText)
            return <Redirect to={{
                pathname: '/createHistory',
                state: {create: false}
            }} />

        if (back)
            return <Redirect to='/readhistory'/>
        
        if (home)
            return <Redirect to='/' />
        
        return ( 
            <TemplateHistory handleBack={this.handleBack}
                handleEditor={this.handleEditor}
                handleIsPublic={this.handleIsPublic} 
                history={ {...history, text, isPublic, edit, isModifed, auth} }
                save={this.save}
                addAlternativeText={this.addAlternativeText}
                deleteHistory={this.deleteHistory} />
         )
    }
}
 
const mapStateToProps = state => ({ auth: state.auth.user, narrativeText: state.narrativeText })
const mapDispatchToProps = dispatch => bindActionCreators({
    putHistory,
    getHistory,
    setCreated,
    deleteHistory,
    getMyAlternativeText,
    dispatch
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(WriteHistory)