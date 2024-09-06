import axios from 'axios'
import { host } from '../config/config'

const baseUrl = `${host}/order`

// 주문 목록 요청 함수
export const orderList = status => {
    return axios.get(`${baseUrl}/listByStatus`, {
        params: { status }, // 쿼리 파라미터로 status를 전달
    })
}
