import { api } from '../config/config'

// 파일 업로드 요청 함수
export const uploadFile = formData => {
    return api.post(`/file`, formData)
}
