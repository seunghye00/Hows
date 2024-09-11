import axios from 'axios'
import { api, host } from '../config/config'

const baseUrl = `${host}/member`

/** 유저 정보  **/
export const userInfo = member_id => {
    console.log(member_id)
    if (member_id) {
        return api.get(`/member/selectInfo`, { params: { member_id } })
    } else {
        return api.get(`/member/selectInfo`)
    }
}

// 로그인
export const loginUser = (user) => {
    return axios.post(`${host}/auth`, user);
}

// 아이디 찾기
export const findId = (name, email) => {
    return api.post(`/auth/findId`, { name, email });
};

// [비밀번호 찾기] 사용자 인증 확인
export const verifyUser = (member_id, email) => {
    const params = { member_id, email };
    return axios.post(`${host}/auth/sendTempPw`, params);
}

// [마이페이지 회원정보 수정] 닉네임 중복 확인
export const checkNickname = (nickname) => {
    return api.post(`/member/checkNickname`, { nickname });
};

// [마이페이지 비밀번호 변경] 현재 비밀번호 확인
export const checkCurrentPw = (currentPw) => {
    return api.post(`/member/checkPw`, { pw: currentPw });
};

// [마이페이지 비밀번호 변경] 서버로 새 비밀번호 전송
export const updatePw = pw => {
    return api.put(`/member/updatePw`, { pw })
}

// [마이페이지] 특정 멤버의 member_seq 가져오기
export const findMemberSeq = (member_id) => {
    return api.get(`/guestbook/findMemberSeq`, { params: { member_id } });
};

// 프로필 이미지 업로드
export const uploadProfileImage = (file, memberSeq) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('member_seq', memberSeq)

    return api.post('/member/uploadProfileImage', formData)
}

// 프로필 이미지 삭제
export const deleteProfileImage = memberSeq => {
    return api.delete('/member/deleteProfileImage', {
        params: { member_seq: memberSeq },
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
export const selectPost = (member_id) => {
    return api.get(`/member/selectPost`, { params: { member_id } });
};

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

// 등급 업데이트
export const updateGrade = ({ member_id, grade_code }) => {
    return api.put(`${baseUrl}/updateGrade`, { member_id, grade_code })
}

// 역할 업데이트
export const updateRole = ({ member_id, role_code }) => {
    return api.put(`${baseUrl}/updateRole`, { member_id, role_code })
}

// 블랙리스트 사유 가져오기
export const getAllBlacklistReasons = () => {
    return api.get(`${baseUrl}/blacklistreason`)
}

// 블랙리스트 등록
export const addBlacklist = ({ member_id, blacklist_reason_code }) => {
    return api.post(`${baseUrl}/addBlacklist`, {
        member_id,
        blacklist_reason_code,
    })
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
