import { create } from "zustand";

/**
 *  상태관리 사용 함수 작성
 *  zustand를 통한  데이터 상태 관리
 *  해당기능.js 파일 만들어서 관리
 */

export const useStore = create((set) => {

})

/* 유나 */
// 회원
// export const useMemberStore = create((set) => ({
//     member: [],
//     setMember: (member) => set({ member })
// }));

export const useAuthStore = create((set) => ({
    token: null,
    isAuth: false,

    login: (token) => set({ token, isAuth: true }),
    logout: () => set({ token: null, isAuth: false }),
    // setIsAuth: (val) => set({ isAuth: val })
}));