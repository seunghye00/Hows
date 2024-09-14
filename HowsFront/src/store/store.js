import { create } from 'zustand'

/**
 *  상태관리 사용 함수 작성
 *  zustand를 통한  데이터 상태 관리
 *  해당기능.js 파일 만들어서 관리
 */

export const useStore = create(set => { })

/* 유나 */
// 회원
export const useMemberStore = create(set => ({
    memberSeq: 0,
    memberId: null,
    currentUser: { // 현재 사용자 정보를 초기화
        nickname: '', // 사용자 닉네임
        member_avatar: '' // 사용자 프로필 이미지
    },

    setMemberSeq: seq => set({ memberSeq: seq }),
    setMemberId: id => set({ memberId: id }),
    setCurrentUser: user => set({ currentUser: user })
}))

export const useAuthStore = create(set => ({
    token: null,
    isAuth: false,

    login: token => set({ token, isAuth: true }),
    logout: () => set({ token: null, isAuth: false }),
    setIsAuth: auth => set({ isAuth: auth }),
}))
