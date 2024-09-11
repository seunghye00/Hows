import axios from 'axios'
import { host } from '../config/config'

const baseUrl = `${host}/product`
const categoryUrl = `${host}/category`

// 상품 카테고리 목록 요청 함수
export const categoryList = () => {
    return axios.get(`${categoryUrl}`)
}

// 상품 목록 요청 함수
export const productList = () => {
    return axios.get(`${baseUrl}`)
}

// 상품 추가 요청 함수
export const addProduct = formData => {
    return axios.post(`${baseUrl}`, formData)
}

// 관리자!
// 신고 리뷰 조회 (관리자)
export const reportedReviews = () => {
    return axios.get(`${baseUrl}/reportedReviews`)
}

// 신고 내역 조회 (관리자)
export const reviewReport = review_seq => {
    return axios.get(`${baseUrl}/reviewReport/${review_seq}`)
}

// 상품 삭제 요청 함수
export const deleteProducts = productSeqs => {
    const seqs = productSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return axios.delete(`${baseUrl}`, { params: { seqs } })
}
