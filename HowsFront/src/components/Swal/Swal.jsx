import Swal from 'sweetalert2'

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
