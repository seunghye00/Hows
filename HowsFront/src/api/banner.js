import axios from 'axios'
import { host } from '../config/config'

const baseUrl = `${host}/banner`

export const bannerList = () => {
    return axios.get(`${baseUrl}`)
}
