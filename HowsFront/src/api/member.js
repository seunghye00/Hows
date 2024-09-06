import axios from 'axios'
import { api, host } from '../config/config'

const baseUrl = `${host}/member`

// 서버로 새 비밀번호 전송
export const updatePw = (pw) => {
    return api.put(`/member/updatePw`, { pw });
}
