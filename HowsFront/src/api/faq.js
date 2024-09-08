import axios from 'axios'
import { api, host } from '../config/config'

const baseUrl = `${host}/faq`

// FAQ 등록
export const insertFaq = faqData => {
    return api.post(baseUrl, faqData)
}

// FAQ 조회 (전체)
export const selectAllFaq = () => {
    return api.get(baseUrl)
}

// FAQ 수정
export const modifyFaq = (faq_seq, faqData) => {
    return api.put(`${baseUrl}/${faq_seq}`, faqData)
}

// FAQ 삭제
export const deleteFaq = faq_seq => {
    return api.delete(`${baseUrl}/${faq_seq}`)
}
