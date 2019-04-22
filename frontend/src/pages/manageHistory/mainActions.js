import axios from 'axios'
import { toastr } from 'react-redux-toastr'

const BASE_URL = 'http://localhost:3003/api/narrativeText'
const INITIAL_VALUES = { historys: [{}] }

export function getList() {
    const request = axios.get(`${BASE_URL}/index`)
    return {
        type: 'HISTORYS_FETCHED',
        payload: request
    }
}