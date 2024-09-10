import axios from 'axios'
import { host } from '../config/config'

const baseUrl = `${host}/file`

// 파일 업로드 요청 함수
export const uploadFile = formData => {
    return axios.post(`${baseUrl}`, formData)
}
