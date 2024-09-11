import { api } from '../config/config'

// FAQ 등록
export const insertFaq = faqData => {
    return api.post('/faq', faqData)
}

// FAQ 조회 (전체)
export const selectAllFaq = () => {
    return api.get('/faq')
}

// FAQ 수정
export const modifyFaq = (faq_seq, faqData) => {
    return api.put(`/faq/${faq_seq}`, faqData)
}

// FAQ 삭제
export const deleteFaq = faq_seq => {
    return api.delete(`/faq/${faq_seq}`)
}
