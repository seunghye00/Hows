import axios from 'axios'
import { host, api } from '../config/config'

const baseUrl = `${host}/product`
const likeUrl = `${host}/likes`

/************************************ [사용자 기능] ************************************/
// 랜덤 상품 출력 함수 (내장함수 DBMS_RANDOM.VALUE 사용)
export const getRandomProducts = () => {
    return axios.get(`${baseUrl}`)
}

// 베스트 상품 출력 함수 (판매순)
export const getBestProducts = () => {
    return axios.get(`${baseUrl}/getBestProducts`)
}

// 리뷰 많은 순 상품 출력 함수
export const getProductBytReview = () => {
    return axios.get(`${baseUrl}/getProductBytReview`)
}

// 카테고리 목록 출력 함수
export const handleMenusClick = (
    product_category_code,
    setProductsList,
    setData
) => {
    setProductsList([]) // 기존 데이터 초기화
    return axios
        .get(`${baseUrl}/category/${product_category_code}`)
        .then(resp => {
            setData(resp.data)
        })
        .catch(err => {
            console.error(err)
        })
}

// 카테고리 메뉴 출력
export const fetchCategories = async (
    setCategoriesList,
    handleMenuClick,
    categoryCode
) => {
    try {
        const resp = await axios.get(`${host}/category`)
        setCategoriesList(resp.data)

        if (categoryCode == null) {
            handleMenuClick('P1')
        } else {
            handleMenuClick(categoryCode)
        }
    } catch (err) {
        console.error(err)
    }
}

// 리뷰 구매 상태 확인
export const checkPurchaseStatus = async (memberId, productSeq) => {
    try {
        const response = await axios.get(
            `${baseUrl}/review/checkPurchaseStatus`,
            {
                params: { memberId, productSeq },
            }
        )
        return response.data
    } catch (error) {
        console.error('구매 상태 확인 오류:', error)
        return false
    }
}

// 리뷰 작성 가능 여부 확인
export const checkCanWriteReview = async (memberId, productSeq) => {
    try {
        const response = await axios.get(`${baseUrl}/review/canWriteReview`, {
            params: { memberId, productSeq },
        })
        return response.data
    } catch (error) {
        console.error('리뷰 작성 가능 여부 확인 오류:', error)
        return false
    }
}

// 리뷰 목록 요청 함수
export const getReviewList = (product_seq, page, itemsPerPage, sortType) => {
    return sortType === 'latest'
        ? api.get(`product/getReviewList/${product_seq}`, {
              params: {
                  page: page, // 페이지 번호 전달
                  itemsPerPage: itemsPerPage, // 페이지당 항목 수 전달
              },
          })
        : api.get(`product/getReviewListByBest/${product_seq}`, {
              params: {
                  page: page, // 페이지 번호 전달
                  itemsPerPage: itemsPerPage, // 페이지당 항목 수 전달
              },
          })
}

// 별점
export const getRatings = product_seq => {
    return axios.get(`${baseUrl}/review/getRatings/${product_seq}`)
}

// 상품 상세 정보 요청 함수
export const getProductDetail = product_seq => {
    return axios.get(`${baseUrl}/detail/${product_seq}`)
}

// 상품 좋아요 개수
export const getLikeCount = product_seq => {
    return axios.get(`${likeUrl}/count`, {
        params: {
            product_seq: product_seq,
        },
    })
}

// 상품 좋아요 상태 확인
export const checkLikeStatus = (product_seq, memberId) => {
    return api.get(`${likeUrl}/check`, {
        params: {
            product_seq,
            member_id: memberId || '', // memberId가 없으면 빈 문자열 전달
        },
    })
}

// 상품 좋아요 추가
export const addLike = (product_seq, memberId) => {
    return api.post(`${likeUrl}/insert`, { product_seq, member_id: memberId })
}

// 상품 좋아요 취소
export const removeLike = (product_seq, memberId) => {
    return api.delete(`${likeUrl}/delete`, {
        data: {
            product_seq,
            member_id: memberId,
        },
    })
}

// 상품 장바구니에 상품 추가
export const addToCartAPI = data => {
    return api.post(`/cart`, data)
}

// 리뷰 등록
export const addReview = formData => {
    return api.post(`${baseUrl}/reviewAdd`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

// 리뷰 삭제
export const delReview = review_seq => {
    return api.delete(`${baseUrl}/delReview/${review_seq}`)
}

// 리뷰 좋아요
export const reviewLike = (reviewSeq, memberId) => {
    return api.post(`${likeUrl}/review/insert`, {
        review_seq: reviewSeq,
        member_id: memberId,
    })
}

// 리뷰 수정
export const modifyReview = formData => {
    return api.post(`${baseUrl}/reviewMod`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

// 리뷰 좋아요 취소
export const reviewUnlike = (reviewSeq, memberId) => {
    return api.delete(`${likeUrl}/review/delete`, {
        data: {
            review_seq: reviewSeq,
            member_id: memberId,
        },
    })
}

// 리뷰 좋아요 수 가져오기
export const getReviewLikeCount = reviewSeq => {
    return axios.get(`${likeUrl}/review/count`, {
        params: {
            review_seq: reviewSeq,
        },
    })
}

// 리뷰 좋아요 상태 확인
export const checkReviewLikeStatus = (reviewSeq, memberId) => {
    return api.get(`${likeUrl}/review/check`, {
        params: {
            review_seq: reviewSeq,
            member_id: memberId,
        },
    })
}

// 리뷰 이미지
export const getReviewImgList = reviewSeq => {
    return axios.get(`${baseUrl}/getReviewImgList/${reviewSeq}`)
}

// 리뷰 신고 옵션 불러오기
export const getReport = async () => {
    try {
        const response = await api.get('/option/report')
        return response.data
    } catch (error) {
        throw error
    }
}

// 리뷰 신고 요청
export const sendReviewReport = (reviewSeq, selectedReason, memberId) => {
    return api.post(`${baseUrl}/review/report`, {
        review_seq: reviewSeq,
        report_code: selectedReason,
        member_id: memberId,
    })
}

/************************************  [ 관리자 기능 ] /************************************/

// 신고 리뷰 조회 (관리자)
export const reportedReviews = (startRow, endRow) => {
    return api.get(`/product/reportedReviews`, {
        params: {
            startRow: startRow,
            endRow: endRow,
        },
    })
}

// 신고 내역 조회 (관리자)
export const reviewReport = review_seq => {
    return api.get(`/product/reviewReport/${review_seq}`)
}

// 신고 리뷰 삭제 (관리자)
export const deleteReview = review_seq => {
    return api.delete(`/product/deleteReview/${review_seq}`)
}

// 상품 카테고리 목록 요청 함수
export const categoryList = () => {
    return api.get('/category')
}

// 상품 목록 요청 함수
export const productList = () => {
    return api.get('/product')
}

// 상품 목록 요청 함수 (관리자)
export const productListByAdmin = () => {
    return api.get('/product/getProductsByAdmin')
}

// 상품 추가 요청 함수
export const addProduct = formData => {
    return api.post('/product', formData)
}

// 상품 삭제 요청 함수
export const deleteProducts = productSeqs => {
    const seqs = productSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return api.delete('/product', { params: { seqs } })
}

// 상품 정보 조회 함수
export const getProductInfo = product_seq => {
    return api.get(`/product/detail/${product_seq}`)
}

// 상품 수량 변경 요청 함수
export const updateProductByQuantity = (productSeqs, quantity) => {
    const seqs = productSeqs.join(',') // 배열을 쉼표로 구분된 문자열로 변환
    return api.put('/product', null, { params: { seqs, quantity } })
}

// 카테고리별 상품 수 조회 함수
export const getProductNumByCategory = () => {
    return api.get('/product/getProductNumByCategory')
}

// 조건별 베스트 상품 조회 함수
export const getBestProduct = condition => {
    return api.get(`/product/getBestProduct/${condition}`)
}
