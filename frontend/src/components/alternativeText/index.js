import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { postAlternativeText } from '../../pages/manageHistory/mainActions'
import './style.css'

class AlternativeText extends Component {

    criarEnredoAlternativo = (alternativeText) => {
        const { auth } = this.props
        const { text, title } = alternativeText

        const narrativeText = { author: { ...auth }, text, title }
        const idHistory = this.props.history._id
        this.props.postAlternativeText(idHistory, narrativeText)
        this.props.update()
    }

    render() {
        return (
            <div>
                {this.props.alternativesTexts.data.length === 0 ?
                    <p className='alternativeText-p'>Carregando ...</p>
                    :
                    this.props.alternativesTexts.data.map(alternativeText => (
                        <button key={alternativeText._id}
                            className='alternativeText-list'
                            onClick={() => this.criarEnredoAlternativo(alternativeText)} >
                            {alternativeText.title}
                        </button>
                    )
                    )}
            </div>
        )
    }
}

const mapStateToProps = state => ({ auth: state.auth.user, alternativesTexts: state.narrativeText.alternativesTexts })
const mapDispatchToProps = dispatch => bindActionCreators({ postAlternativeText }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(AlternativeText)