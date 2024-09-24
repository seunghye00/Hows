import axios from 'axios'
import { api, host } from '../config/config'

const baseUrl = `${host}/member`

// 회원가입
// ID 중복확인
export const checkIdForSignUp = memberId => {
    return axios.post(`${baseUrl}/checkId`, { member_id: memberId })
}

// 닉네임 중복확인
export const checkNicknameForSignUp = nickname => {
    return axios.post(`${baseUrl}/checkNickname`, { nickname: nickname })
}

// 이메일 중복확인
export const checkEmailForSignUp = email => {
    return axios.post(`${baseUrl}/checkEmail`, { email: email })
}

/** 유저 정보  **/
export const userInfo = member_id => {
    if (member_id) {
        return api.get(`/member/selectInfo`, { params: { member_id } })
    } else {
        return api.get(`/member/selectInfo`)
    }
}

// 관리자 권한 가져오기
export const getRoleCode = () => {
    return api.get(`/member/getRoleCode`)
}

// 로그인
export const loginUser = user => {
    return axios.post(`${host}/auth`, user)
}

// 아이디 찾기
export const findId = (name, email) => {
    return api.post(`/auth/findId`, { name, email })
}

// [비밀번호 찾기] 사용자 인증 확인
export const verifyUser = (member_id, email) => {
    const params = { member_id, email }
    return axios.post(`${host}/auth/sendTempPw`, params)
}

// [마이페이지 회원정보 수정] 닉네임 중복 확인
export const checkNickname = nickname => {
    return api.post(`/member/checkNickname`, { nickname })
}

// [마이페이지 회원정보 수정] 이메일 중복 확인
export const checkEmail = email => {
    return api.post(`/member/checkEmail`, { email })
}

// [마이페이지 비밀번호 변경] 현재 비밀번호 확인
export const checkCurrentPw = currentPw => {
    return api.post(`/member/checkPw`, { pw: currentPw })
}

// [마이페이지 비밀번호 변경] 서버로 새 비밀번호 전송
export const updatePw = pw => {
    return api.put(`/member/updatePw`, { pw })
}

// [마이페이지] 특정 멤버의 member_seq 가져오기
export const findMemberSeq = member_id => {
    return api.get(`/guestbook/findMemberSeq`, { params: { member_id } })
}

// 프로필 이미지 업로드
export const uploadImage = (file, memberSeq, imageType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('member_seq', memberSeq)
    formData.append('type', imageType) // 타입 추가

    return api.post('/member/uploadImage', formData)
}

// 프로필 이미지 삭제
export const deleteImage = (memberSeq, imageType) => {
    return api.delete('/member/deleteImage', {
        params: { member_seq: memberSeq, type: imageType },
    })
}

// Guestbook 추가
export const insertGuestbook = requestBody => {
    return api.post(`/guestbook/insert`, requestBody)
}

// 특정 member_seq에 대한 guestbook 목록 조회
export const getGuestbookList = memberSeq => {
    return api.get(`/guestbook/list`, { params: { member_seq: memberSeq } })
}

// 특정 guestbook_seq에 대한 삭제 요청
export const deleteGuestbook = guestbook_seq => {
    return api.delete(`/guestbook/${guestbook_seq}`)
}

// 게시글 출력
export const selectPost = member_id => {
    return api.get(`/member/selectPost`, { params: { member_id } })
}

// 스크랩(북마크) 출력
export const selectBookmark = member_id => {
    return api.get(`/member/selectBookmark`, { params: { member_id } })
}

// 게시물 개수
export const countPost = member_id => {
    return api.get(`/member/countPost`, { params: { member_id } })
}

// 북마크 개수
export const countBookmark = member_id => {
    return api.get(`/member/countBookmark`, { params: { member_id } })
}

// 방명록 개수
export const countGuestbook = member_seq => {
    return api.get(`/guestbook/countGuestbook`, { params: { member_seq } })
}

// 팔로우/언팔로우 처리 API 호출 함수
export const toggleFollow = async data => {
    return api.post(`${baseUrl}/follow`, data) // API 요청으로 팔로우/언팔로우 처리
}

// 팔로워, 팔로잉 수
export const getCountFollow = member_seq => {
    return api.get(`/member/countFollow`, { params: { member_seq } })
}

// 팔로워 목록
export const getFollower = member_seq => {
    return api.get(`/member/getFollower`, { params: { member_seq } })
}

// 팔로잉 목록
export const getFollowing = member_seq => {
    return api.get(`/member/getFollowing`, { params: { member_seq } })
}

// [마이페이지 메인 팔로우 버튼] 내가 상대방 팔로우 했는지 버튼 표시
export const eachFollow = (fromMemberSeq, toMemberSeq) => {
    const params = {
        from_member_seq: fromMemberSeq,
        to_member_seq: toMemberSeq,
    }
    return api.post('/member/eachFollow', params)
}

// 회원탈퇴
export const deleteUser = memberId => {
    return api.delete(`/member/deleteUser/${memberId}`)
}

export const adminstart = () => {
    // 여기서 밑 부터 관리자 기능!
}
/************************************  [ 관리자 기능 ] /************************************/

// 전체 회원 조회
export const selectAll = (startRow, endRow, chosung = '', searchTerm = '') => {
    return api.get(`${baseUrl}/all`, {
        params: {
            startRow,
            endRow,
            chosung,
            searchTerm,
        },
    })
}

// 회원 상세 조회
export const detailMember = member_id => {
    return api.get(`${baseUrl}/detail?member_id=${member_id}`)
}

// 등급 가져오기
export const getAllGrades = () => {
    return api.get(`${baseUrl}/grades`)
}

// 역할 가져오기
export const getAllRoles = () => {
    return api.get(`${baseUrl}/roles`)
}

// 등급 및 역할 업데이트
export const updateMemberStatus = ({
    member_id,
    grade_code,
    role_code,
    blacklist_reason_code,
}) => {
    const data = {
        member_id,
        grade_code,
        role_code,
        blacklist_reason_code, // 블랙리스트 등록 시 이유를 함께 전달
    }

    return api.put(`${baseUrl}/updateMemberStatus`, data) // 서버에서 이 API를 통해 업데이트
}

// 블랙리스트 사유 가져오기
export const getAllBlacklistReasons = () => {
    return api.get(`${baseUrl}/blacklistreason`)
}

// 블랙리스트 조회
export const selectBlacklist = (
    startRow,
    endRow,
    chosung = '',
    searchTerm = ''
) => {
    return api.get(`${baseUrl}/blacklist`, {
        params: {
            startRow,
            endRow,
            chosung,
            searchTerm,
        },
    })
}

// 블랙리스트 수정 (블랙리스트 해제)
export const modifyBlacklist = ({ member_id }) => {
    return api.put(`${baseUrl}/modifyBlacklist`, { member_id })
}

// 연령대별 남녀 멤버 수 조회
export const getAgeGenderDistribution = () => {
    return api.get('/member/getAgeGenderDistribution')
}
