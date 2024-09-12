import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { detailNtc, modifyNtc } from '../../../api/notice'
import { Button } from '../../../components/Button/Button'
import { SwalComp } from '../../../commons/commons'
import { EditorComp } from '../../../components/Editor/Editor'
import styles from './ModifyNotice.module.css'

export const ModifyNotice = () => {
    const { notice_seq } = useParams() // URL에서 notice_seq를 가져옴
    const [notice, setNotice] = useState({
        notice_title: '',
        notice_contents: '',
    })
    const navigate = useNavigate()

    // 수정할 공지사항 데이터를 불러옴
    useEffect(() => {
        // 시퀀스 로그 추가
        console.log(`수정할 공지사항 시퀀스 ID: ${notice_seq}`)

        const fetchNoticeDetails = async () => {
            try {
                console.log('Fetching notice details for ID:', notice_seq) // notice_seq 로그
                const response = await detailNtc(notice_seq) // API 호출로 기존 데이터 불러옴

                // 불러온 데이터를 상태에 저장하기 전에 출력
                console.log('API response:', response) // response 전체 출력
                console.log('Fetched notice data:', response.data) // 불러온 데이터 로그

                const noticeData = response.data
                setNotice({
                    notice_title: noticeData.notice_title,
                    notice_contents: noticeData.notice_contents,
                })
            } catch (error) {
                console.error('API 호출 실패. 응답 오류:', error.response) // 응답 에러 로그
                console.error('공지사항 불러오기 실패:', error.message) // 에러 메시지 로그
                SwalComp({
                    type: 'error',
                    text: `공지사항 데이터를 불러오지 못했습니다. 오류: ${error.message}`,
                })
            }
        }

        fetchNoticeDetails()
    }, [notice_seq])

    // 입력 필드 변경 핸들러
    const handleInputChange = e => {
        const { name, value } = e.target
        console.log(`Input field changed: ${name} = ${value}`) // 필드 변경 로그
        setNotice(prev => ({ ...prev, [name]: value }))
    }

    // 에디터 내용 변경 핸들러
    const handleEditorChange = content => {
        console.log('Editor content changed:', content) // 에디터 내용 변경 로그
        setNotice(prev => ({ ...prev, notice_contents: content }))
    }

    // 수정 완료 핸들러
    const handleSubmit = async () => {
        try {
            const formData = new FormData()
            formData.append('notice_seq', notice_seq) // notice_seq 추가
            formData.append('notice_title', notice.notice_title)
            formData.append('notice_contents', notice.notice_contents)

            // 수정할 데이터 로그
            console.log('FormData to be submitted:', {
                notice_seq,
                notice_title: notice.notice_title,
                notice_contents: notice.notice_contents,
            })

            // 기존 insertNtc가 아닌 modifyNtc를 호출하여 수정 요청을 보냅니다.
            await modifyNtc(notice_seq, formData) // 수정 API 호출
            console.log('수정할 공지사항 ID:', notice_seq)
            SwalComp({
                type: 'success',
                text: '공지사항이 수정되었습니다.',
            }).then(() => navigate('/admin/notice')) // 수정 후 목록으로 이동
        } catch (error) {
            console.error('공지사항 수정 실패:', error)
            SwalComp({ type: 'error', text: '공지사항 수정에 실패했습니다.' })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <input
                    type="text"
                    placeholder="공지사항 제목을 입력해주세요"
                    name="notice_title"
                    value={notice.notice_title} // 불러온 데이터를 입력 필드에 적용
                    onChange={handleInputChange}
                />
            </div>
            <div className={styles.writeWrap}>
                <EditorComp
                    onChange={handleEditorChange}
                    contents={notice.notice_contents} // 에디터의 초기값을 불러온 데이터로 설정
                />
            </div>
            <div className={styles.btns}>
                <Button size={'s'} title={'완료'} onClick={handleSubmit} />
                <Button
                    size={'s'}
                    title={'취소'}
                    onClick={() => navigate('/admin/notice')}
                />
            </div>
        </div>
    )
}
