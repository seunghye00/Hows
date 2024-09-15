import axios from 'axios'
import { host, api } from '../config/config'

const baseUrl = `${host}/product`
const categoryUrl = `${host}/category`
const likeUrl = `${host}/likes`

/************************************ [사용자 기능] ************************************/
// 베스트 상품 출력 함수 (판매순)
export const getBestProducts = () => {
    return axios.get(`${baseUrl}/getBestProducts`)
}

// 리뷰 목록 요청 함수
export const getReviewList = (product_seq, page, itemsPerPage) => {
    return axios.get(`${baseUrl}/getReviewList/${product_seq}`, {
        params: {
            page : page, // 페이지 번호 전달
            itemsPerPage : itemsPerPage, // 페이지당 항목 수 전달
        }
    })
}
// 상품 상세 정보 요청 함수
export const getProductDetail = (product_seq) => {
    return axios.get(`${baseUrl}/detail/${product_seq}`)
}

// 좋아요 개수
export const getLikeCount = (product_seq) => {
    return axios.get(`${likeUrl}/count`, {
        params: {
            product_seq : product_seq,
        }
    })
}

// 리뷰 이미지 
export const getReviewImgList = (reviewSeq) => {
    return axios.get(`${baseUrl}/getReviewImgList/${reviewSeq}`);
}



/************************************ / [사용자 기능] ************************************/

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

/************************************  [ 관리자 기능 ] /************************************/

// 신고 리뷰 조회 (관리자)
export const reportedReviews = (startRow, endRow) => {
    return axios.get(`${baseUrl}/reportedReviews`, {
        params: {
            startRow: startRow,
            endRow: endRow,
        },
    })
}

// 신고 내역 조회 (관리자)
export const reviewReport = review_seq => {
    return axios.get(`${baseUrl}/reviewReport/${review_seq}`)
}

// 신고 리뷰 삭제 (관리자)
export const deleteReview = review_seq => {
    return axios.delete(`${baseUrl}/deleteReview/${review_seq}`)
}

// 상품 삭제 요청 함수
export const deleteProducts = productSeqs => {
    const seqs = productSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return axios.delete(`${baseUrl}`, { params: { seqs } })
}

// 상품 정보 조회 함수
export const getProductInfo = product_seq => {
    return axios.get(`${baseUrl}/detail/${product_seq}`)
}

// 상품 수량 변경 요청 함수
export const updateProductByQuantity = (productSeqs, quantity) => {
    const seqs = productSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return axios.put(`${baseUrl}`, null, { params: { seqs, quantity } })
}
