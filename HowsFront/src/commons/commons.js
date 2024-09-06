/**
 * 공통 함수 만들어서 사용
 * 예 : 날짜 변환 등
 */

import { format } from 'date-fns'

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
