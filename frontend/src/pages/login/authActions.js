import { toastr } from 'react-redux-toastr'
import axios from 'axios'
import consts from '../../consts'

export function login(values) {
    return submit(values, `${consts.OAPI_URL}/login`)
}

export function signup(values) {
    return submit(values, `${consts.OAPI_URL}/signup`)
}

function submit(values, url) {
    return dispatch => {
        axios.post(url, values)
            .then(resp => {
                dispatch([
                    { type: consts.USER_FETCHED, payload: resp.data }
                ])
            })
            .catch(e => {
                e.response.data.errors.forEach(
                    error => toastr.error('Erro', error))
            })
    }
}

export function logout() {
    return { type: consts.TOKEN_VALIDATED, payload: false }
}

export function validateToken(token) {
    return dispatch => {
        if (token)
            axios.post(`${consts.OAPI_URL}/validateToken`, { token })
                .then(resp => 
                    dispatch({ type: consts.TOKEN_VALIDATED, payload: resp.data.valid })
                )
                .catch(e => dispatch({ type: consts.TOKEN_VALIDATED, payload: false }))
        else
            dispatch({ type: consts.TOKEN_VALIDATED, payload: false })
    }
}

export function forgotPassword(email) {
    if (email.email !== undefined)
        return dispatch => 
            axios.post(`${consts.OAPI_URL}/forgotPassword`, { ...email })
                .then(resp => {
                    toastr.success('Sucesso', resp.data.success)
                    dispatch([
                        { type: consts.USER_RESET, payload: true }
                    ])
                })
                .catch(e => {
                    e.response.data.errors.forEach(
                        error => toastr.error('Erro', error))
                    dispatch([
                        { type: consts.USER_RESET, payload: false }
                    ])
                })
    else
        return dispatch => {
            toastr.error('Erro', 'E-mail inválido')
            dispatch([
                { type: consts.USER_RESET, payload: false }
            ])
        }
}

export function resetPassword(values) {
    const { password, confirm_password, email, token } = values

    if(email!==undefined)
        if (password!==undefined && password === confirm_password)
            if(token!==undefined)
                return dispatch => 
                    axios.post(`${consts.OAPI_URL}/resetPassword`, { ...values })
                        .then(resp => {
                            toastr.success('Sucesso', 'Senha alterada com sucesso')
                            dispatch([
                                { type: consts.USER_FETCHED, payload: resp.data }
                            ])
                        })
                        .catch(e => {
                            e.response.data.errors.forEach(
                                error => toastr.error('Erro', error))
                        })
            else
                return dispatch => toastr.error('Erro', 'Informe o Token')
        else
            return dispatch => toastr.error('Erro', 'Senhas não conferem')
    else
        return dispatch => toastr.error('Erro', 'Informe o E-mail')
}