import axios from 'axios'
import { useAuthStore } from '../store/store'
import { SwalComp } from '../commons/commons'

// 설정 변수
const { REACT_APP_BASE_URL } = process.env
export const host = REACT_APP_BASE_URL

// API base url 설정
export const api = axios.create({
  baseURL: `${host}`,
})

// 요청 인터셉터 설정
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})


// 에러 처리 함수
const handleError = error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        sessionStorage.removeItem('token')
        useAuthStore.getState().logout()
        break
      case 403:
        sessionStorage.removeItem('token')
        useAuthStore.getState().logout()
        SwalComp({
          type: 'warning',
          text: '로그인 후 이용할 수 있습니다.',
        }).then(() => {
          window.location.href = '/signIn'
        })
        break
      // 다른 에러 코드 추가 가능
      default:
        SwalComp({
          type: 'error',
          text: '알 수 없는 오류가 발생했습니다.',
        })
    }
  }
  return Promise.reject(error)
}

// 응답 인터셉터 설정
api.interceptors.response.use(response => response, handleError)
