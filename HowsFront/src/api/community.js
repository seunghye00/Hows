import { api } from '../config/config'
// 게시글 목록 가져오기
export const getCommunityPosts = async (page, limit = 20) => {
    try {
        const response = await api.get('/community', {
            params: { page, limit },
        })
        // response.data가 없는 경우 빈 배열 반환
        return response.data || []
    } catch (error) {
        throw error // 오류 발생 시 예외 처리
    }
}

// 게시글 좋아요 토글
export const toggleLike = (board_seq, member_id) => {
    return api.post(`/community/${board_seq}/like`, { member_id })
}

// 게시글 북마크 토글
export const toggleBookmark = (board_seq, member_id) => {
    return api.post(`/community/${board_seq}/bookmark`, { member_id })
}

// 팔로우/언팔로우 토글
export const toggleFollow = nickname => {
    return api.post(`/user/${nickname}/follow`)
}

// 게시글 데이터 가져오기
export const getPostData = board_seq => {
    return api.get(`/community/${board_seq}`)
}

// 이미지 데이터 가져오기
export const getImageData = board_seq => {
    return api.get(`/community/images/${board_seq}`)
}

// 태그 및 상품 데이터 가져오기
export const getTagData = board_seq => {
    return api.get(`/community/images/${board_seq}`)
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
// 게시글 및 이미지/태그 저장
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
