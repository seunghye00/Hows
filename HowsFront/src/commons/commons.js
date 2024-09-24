import { format } from 'date-fns'
import Swal from 'sweetalert2'

/**
 * 공통 함수 만들어서 사용
 * 예 : 날짜 변환 등
 */

/** 날짜 변환 함수 **/
export const formatDate = dateString => {
    if (!dateString) {
        // null 또는 빈 문자열인 경우 기본값 설정
        return '0000-00-00 00:00'
    }

    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
        // 유효하지 않은 날짜인 경우 기본값 설정
        return '0000-00-00 00:00'
    }

    return format(date, 'yyyy-MM-dd HH:mm')
}

// 날짜 변환 함수 (yyyy-MM-dd)
export const formatDateForInput = date => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/** 금액에 (,)를 추가하는 함수 **/
export const addCommas = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** 배송비 **/
export const shippingPrice = price => {
    return price >= 50000 ? 0 : 3000;
    // return price >= 1000 ? 0 : 3000;
}

/** sweet alert **/
export const SwalComp = ({ type, text }) => {
    // type 종류 : success, error, confirm, warning, question

    switch (type) {
        case 'success':
            return Swal.fire({
                title: '성공!',
                text: text,
                icon: 'success',
                confirmButtonText: '확인',
            })

        case 'error':
            return Swal.fire({
                title: '에러!',
                text: text,
                icon: 'error',
                confirmButtonText: '확인',
            })

        case 'confirm':
            return Swal.fire({
                title: '확인',
                text: text,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
            })

        case 'warning':
            return Swal.fire({
                title: '경고!',
                text: text,
                icon: 'warning',
                confirmButtonText: '확인',
            })

        case 'question':
            return Swal.fire({
                title: '질문',
                text: text,
                icon: 'question',
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                showCancelButton: true,
            })

        default:
            return Swal.fire({
                title: '알림',
                text: text,
                icon: 'info',
                confirmButtonText: '확인',
            })
    }
}

/** 정규 표현식 [ 이름 ]  **/
export const validateName = name => {
    let regex = /^[가-힣]{2,5}$/
    return regex.test(name)
}

/** 정규 표현식 [ 전화번호 ]  **/
export const validatePhone = phone => {
    let regex = /^01([0|1|6|7|8|9])([0-9]{8})$/
    return regex.test(phone)
}
