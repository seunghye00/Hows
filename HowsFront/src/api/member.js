import axios from 'axios'
import { api, host } from '../config/config'

const baseUrl = `${host}/member`

/* ============[마이페이지 회원정보 수정]=========== */
// 닉네임 중복 확인
export const checkNickname = (nickname) => {
    return api.post(`/member/checkNickname`, { nickname });
};

/* ============[마이페이지 비밀번호 변경]=========== */
// 현재 비밀번호 확인
export const checkCurrentPw = (currentPw) => {
    return api.post(`/member/checkPw`, { pw: currentPw });
};

// 서버로 새 비밀번호 전송
export const updatePw = pw => {
    return api.put(`/member/updatePw`, { pw })
}

/* ============[마이페이지]=========== */
// 특정 멤버의 member_seq 가져오기
export const findMemberSeq = (member_id) => {
    return api.get("/guestbook/findMemberSeq", { params: { member_id } });
};

// 프로필 이미지 업로드
export const uploadProfileImage = (file, memberSeq) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('member_seq', memberSeq);

    return api.post("/member/uploadProfileImage", formData);
};

// 프로필 이미지 삭제
export const deleteProfileImage = (memberSeq) => {
    return api.delete("/member/deleteProfileImage", {
        params: { member_seq: memberSeq }
    });
};

/** 유저 정보  **/
export const userInfo = (params) => {
    if(params) {
        return api.get(`/member/selectInfo`, { params } )
    } else {
        return api.get(`/member/selectInfo`);
    }
}


export const adminstart = () => {
    // 여기서 밑 부터 관리자 기능!
}

/************************************  [ 관리자 기능 ] /************************************/

// 전체 회원 조회
export const selectAll = (startRow, endRow, chosung = '', searchTerm = '') => {
    return axios.get(`${baseUrl}/all`, {
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
    return axios.get(`${baseUrl}/detail?member_id=${member_id}`)
}

// 등급 가져오기
export const getAllGrades = () => {
    return axios.get(`${baseUrl}/grades`)
}

// 역할 가져오기
export const getAllRoles = () => {
    return axios.get(`${baseUrl}/roles`)
}

// 등급 업데이트
export const updateGrade = ({ member_id, grade_code }) => {
    return axios.put(`${baseUrl}/updateGrade`, { member_id, grade_code })
}

// 역할 업데이트
export const updateRole = ({ member_id, role_code }) => {
    return axios.put(`${baseUrl}/updateRole`, { member_id, role_code })
}

// 블랙리스트 사유 가져오기
export const getAllBlacklistReasons = () => {
    return axios.get(`${baseUrl}/blacklistreason`)
}

// 블랙리스트 등록
export const addBlacklist = ({ member_id, blacklist_reason_code }) => {
    return axios.post(`${baseUrl}/addBlacklist`, {
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
    return axios.get(`${baseUrl}/blacklist`, {
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
    return axios.put(`${baseUrl}/modifyBlacklist`, { member_id })
}
