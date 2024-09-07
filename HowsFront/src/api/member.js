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

// 전체 회원조회
export const selectAll = () => {
    return api.get('/member/all')
}

// 회원 상세조회
export const detailmember = member_id => {
    return api.get(`/member/detail?member_id=${member_id}`)
}

// 등급 가져오기
export const getAllGrades = () => {
    return api.get('/member/grades')
}

// 역할 가져오기
export const getAllRoles = () => {
    return api.get('/member/roles')
}

// 등급 업데이트
export const updateGrade = ({ member_id, grade_code }) => {
    return api.put('/member/updateGrade', { member_id, grade_code })
}

// 역할 업데이트
export const updateRole = ({ member_id, role_code }) => {
    return api.put('/member/updateRole', { member_id, role_code })
}

// 블랙리스트 사유 가져오기
export const getAllBlacklistReasons = () => {
    return api.get('/member/blacklistreason')
}

// 블랙리스트 등록
export const addBlacklist = ({ member_id, reason }) => {
    return api.post('/member/addBlacklist', { member_id, reason })
}
