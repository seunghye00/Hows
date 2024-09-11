import { api } from '../config/config'

// 게시글 목록 가져오기
export const getCommunityPosts = (page, limit = 20) => {
    return api.get(`/community`, {
        params: { page, limit },
    })
}

// 게시글 좋아요 토글
export const toggleLike = board_seq => {
    return api.post(`/community/${board_seq}/like`)
}

// 게시글 북마크 토글
export const toggleBookmark = board_seq => {
    return api.post(`/community/${board_seq}/bookmark`)
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
