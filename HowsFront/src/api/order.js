import axios from 'axios'
import { host } from '../config/config'

const baseUrl = `${host}/order`

// 주문 목록 요청 함수
export const orderList = type => {
    return axios.get(`${baseUrl}`, type)
}
