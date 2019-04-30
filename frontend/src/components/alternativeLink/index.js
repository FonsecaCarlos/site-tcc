import React, { Component } from 'react'
import api from '../../services/api'

class AlternativeLink extends Component {
    state = {
        history: {}
    }
        

    componentDidMount() {
        this.getHistory(this.props._id)
    }

    getHistory = async (_id) => {
        const resp = await api.get(`/narrativeText/${_id}`)
        const history = resp.data
        this.setState({ history })
    }

    render() {
        const { title } = this.state.history

        return (
            <p {...this.props}  >{ title }</p>
        )
    }
}

export default AlternativeLink