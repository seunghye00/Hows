import axios from 'axios'
import { api, host } from '../config/config'

const baseUrl = `${host}/member`

// 서버로 새 비밀번호 전송
export const updatePw = pw => {
    return api.put(`/member/updatePw`, { pw })
}

export const adminstart = () => {
    // 여기서 밑 부터 관리자 기능!
}

// 전체 회원 조회
export const selectAll = () => {
    return axios.get(`${baseUrl}/all`)
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
export const addBlacklist = ({ member_id, reason }) => {
    return axios.post(`${baseUrl}/addBlacklist`, { member_id, reason })
}

// 블랙리스트 조회
export const selectBlacklist = () => {
    return axios.get(`${baseUrl}/blacklist`)
}

// 블랙리스트 수정 (블랙리스트 해제)
export const modifyBlacklist = ({ member_id }) => {
    return axios.put(`${baseUrl}/modifyBlacklist`, { member_id })
}
