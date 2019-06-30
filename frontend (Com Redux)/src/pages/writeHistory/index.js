import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import { toastr } from 'react-redux-toastr'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { putHistory, getHistory, setCreated } from '../manageHistory/mainActions'

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
            isModifed: false
         }
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
        const isPublic = !this.state.isPublic
        this.setState({isPublic, isModifed: true})
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

        const addAlternativeText = !this.state.addAlternativeText
        this.setState({addAlternativeText})
    }

    render() {
        const { back, addAlternativeText, text, edit, isPublic, isModifed } = this.state
        const { history } = this.props.narrativeText
        const { auth } = this.props

        if (addAlternativeText)
            return <Redirect to={{
                pathname: '/createHistory',
                state: {create: false}
            }} />

        if (back)
            return <Redirect to='/readhistory'/>
        
        return ( 
            <TemplateHistory handleBack={this.handleBack}
                handleEditor={this.handleEditor}
                handleIsPublic={this.handleIsPublic} 
                history={ {...history, text, isPublic, edit, isModifed, auth} }
                save={this.save}
                addAlternativeText={this.addAlternativeText} />
         )
    }
}
 
const mapStateToProps = state => ({ auth: state.auth.user, narrativeText: state.narrativeText })
const mapDispatchToProps = dispatch => bindActionCreators({
    putHistory,
    getHistory,
    setCreated
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(WriteHistory)