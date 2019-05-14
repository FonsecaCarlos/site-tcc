import { toastr } from 'react-redux-toastr'

import api from '../../services/api'

export function setCreated(op) {
    return {
        type: 'SET_CREATED',
        payload: op
    }
}

export function getPublicHistorys(idAuthor, page = 1) {
    const request = api.get(`/narrativeText/indexPublic?page=${page}`)
    return {
        type: 'PUBLIC_HISTORYS_FETCHED',
        payload: request
    }
}

export function getMyHistorys(idAuthor, page = 1) {
    const request = api.get(`/narrativeText/index?page=${page}&idAuthor=${idAuthor}`)
    return {
        type: 'MY_HISTORYS_FETCHED',
        payload: request
    }
}

export function getHistory(idHistory, idAuthor) {
    const request = api.get(`/narrativeText/indexHistory?idHistory=${idHistory}&idAuthor=${idAuthor}`)
    return {
        type: 'HISTORY_FETCHED',
        payload: request
    }
}

export function putHistory(_id, narrativeText) {
    const request = api.put(`/narrativeText/${_id}`, { ...narrativeText })
    return {
        type: 'HISTORY_EDITED',
        payload: request
    }
}

export function postAlternativeText(idHistory, narrativeText) {
    return dispatch => {
        api.post(`/narrativeText/addAlternativeText`, { narrativeText, idHistory })
            .then(resp => {
                toastr.success('Sucesso', 'Operação realizada com sucesso.')
                const { _id, author } = resp.data
                dispatch([
                    getHistory(_id, author),
                    setCreated(true)
                ])
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export function postHistory(narrativeText) {
    return dispatch => {
        api.post(`/narrativeText`, narrativeText)
            .then(resp => {
                toastr.success('Sucesso', 'Operação realizada com sucesso.')
                const { _id, author } = resp.data
                dispatch([
                    getHistory(_id, author),
                    setCreated(true)
                ])
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export function searchHistory(idAuthor, title, page = 1) {
    const request = api.get(`/narrativeText/searchHistory?page=${page}&idAuthor=${idAuthor}&title=${title}`)
    return {
        type: 'HISTORYS_SEARCHED',
        payload: request
    }
}