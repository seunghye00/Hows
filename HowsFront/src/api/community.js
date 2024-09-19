import { api } from '../config/config'
// 게시글 목록 가져오기
export const getCommunityPosts = async ({
    page,
    limit = 20,
    sort = '',
    housingType = '',
    spaceType = '',
    areaSize = '',
    color = '',
    keyword = '',
    member_id,
}) => {
    try {
        // 요청에 사용할 파라미터 설정
        const params = {
            page,
            limit,
            sort,
            housingType,
            spaceType,
            areaSize,
            color,
            keyword,
        }

        // 회원인 경우 member_id 추가
        if (member_id) {
            params.member_id = member_id
        }

        // API 호출
        const response = await api.get('/community', { params })

        return response.data || []
    } catch (error) {
        throw error
    }
}

// 게시글 및 이미지/태그 작성
export const submitPost = async formData => {
    try {
        const response = await api.post(
            '/community/write-with-images',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response
    } catch (error) {
        throw error
    }
}

// 게시글 수정 API
export const updatePostData = async (board_seq, formData) => {
    try {
        const response = await api.put(
            `/community/update-with-images/${board_seq}`,
            formData
        )
        return response
    } catch (error) {
        console.error('게시글 수정 중 오류 발생:', error)
        throw error
    }
}

// 게시글 좋아요 토글
export const toggleLike = (board_seq, member_id) => {
    try {
        return api.post(`/community/${board_seq}/like`, { member_id })
    } catch (error) {
        console.error('게시글 좋아요 토글 중 오류 발생:', error)
        throw error
    }
}

// 게시글 북마크 토글
export const toggleBookmark = (board_seq, member_id) => {
    try {
        return api.post(`/community/${board_seq}/bookmark`, { member_id })
    } catch (error) {
        console.error('게시글 북마크 토글 중 오류 발생:', error)
        throw error
    }
}

// 게시글 데이터 가져오기
export const getPostData = (board_seq, member_id) => {
    try {
        return api.get(`/community/${board_seq}`, {
            params: { member_id },
        })
    } catch (error) {
        console.error('게시글 데이터 가져오기 중 오류 발생:', error)
        throw error
    }
}

// 이미지 데이터 가져오기
export const getImageData = board_seq => {
    try {
        return api.get(`/community/images/${board_seq}`)
    } catch (error) {
        console.error('이미지 데이터 가져오기 중 오류 발생:', error)
        throw error
    }
}

// 태그 및 상품 데이터 가져오기
export const getTagData = board_seq => {
    try {
        return api.get(`/community/images/${board_seq}`)
    } catch (error) {
        console.error('태그 및 상품 데이터 가져오기 중 오류 발생:', error)
        throw error
    }
}

// 집 타입 옵션 가져오기
export const getHousingTypes = async () => {
    try {
        const response = await api.get('/option/housing-types')
        return response.data
    } catch (error) {
        throw error
    }
}

// 공간 타입 옵션 가져오기
export const getSpaceTypes = async () => {
    try {
        const response = await api.get('/option/space-types')
        return response.data
    } catch (error) {
        throw error
    }
}

// 평수 타입 옵션 가져오기
export const getAreaSizes = async () => {
    try {
        const response = await api.get('/option/area-sizes')
        return response.data
    } catch (error) {
        throw error
    }
}

// 컬러 타입 옵션 가져오기
export const getColors = async () => {
    try {
        const response = await api.get('/option/colors')
        return response.data
    } catch (error) {
        throw error
    }
}

//  신고 옵션 가져오기
export const getReport = async () => {
    try {
        const response = await api.get('/option/report')
        return response.data
    } catch (error) {
        throw error
    }
}

// 조회수 증가
export const viewCounting = async board_seq => {
    try {
        const response = await api.post(
            `/community/${board_seq}/increment-view`
        )
        return response.data // 서버에서 반환된 최신 조회수 (int)
    } catch (error) {
        throw error
    }
}

// 게시글 신고
export const sendReport = async (board_seq, report_code, member_id) => {
    try {
        const response = await api.post('/community/report', {
            board_seq,
            report_code,
            member_id,
        })
        return response.data
    } catch (error) {
        console.error('신고 요청 중 오류 발생:', error)
        throw error
    }
}

// 구매내역 상품 불러오기
export const purchaseHistory = async () => {
    try {
        const response = await api.get(`/community/purchaseHistory`)
        return response.data
    } catch (error) {
        throw error
    }
}

// 관리자
// 신고 게시물 조회
export const reportedCommunity = (startRow, endRow) => {
    return api.get(`/community/reportedCommunity`, {
        params: {
            startRow: startRow,
            endRow: endRow,
        },
    })
}

// 신고 내역 조회 (관리자)
export const CommunityReport = board_seq => {
    return api.get(`/community/communityReport/${board_seq}`)
}

// 신고 게시판 삭제 (관리자)
export const deleteCommunity = board_seq => {
    return api.delete(`/community/deleteCommunity/${board_seq}`)
}

// 카테고리별 게시글 수 조회
export const getBoardNumByCategory = () => {
    return api.get('/community/getBoardNumByCategory')
}

// 오늘 작성된 게시글 수 조회
export const todayBoardNum = () => {
    return api.get('/community/todayBoardNum')
}
