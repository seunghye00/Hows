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
        const fetchNoticeDetails = async () => {
            try {
                const response = await detailNtc(notice_seq)
                const noticeData = response.data

                // 이미지 URL 패턴을 찾아서 변환
                const markdownContent = noticeData.notice_contents
                const imageRegex = /(https:\/\/.*?)(\s|$)/g // 이미지 URL을 추출하는 정규 표현식
                const markdownWithImages = markdownContent.replace(
                    imageRegex,
                    '![이미지 설명]($1)'
                )

                // 변환된 내용을 상태로 설정
                setNotice({
                    notice_title: noticeData.notice_title,
                    notice_contents: markdownWithImages, // 텍스트는 그대로, 이미지 URL은 마크다운 형식으로 변경
                })
            } catch (error) {
                console.error('공지사항 불러오기 실패:', error)
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
            const { notice_title, notice_contents } = notice

            // 제목 또는 내용이 비어있는 경우 경고 메시지 표시
            if (!notice_title.trim()) {
                SwalComp({
                    type: 'error',
                    text: '제목을 입력하세요.',
                })
                return
            }

            if (!notice_contents.trim()) {
                SwalComp({
                    type: 'error',
                    text: '내용을 입력하세요.',
                })
                return
            }

            const markdownContent = notice.notice_contents

            // 이미지 URL만 추출하여 변환
            const imageRegex = /!\[.*?\]\((.*?)\)/g
            const contentWithoutMarkdown = markdownContent.replace(
                imageRegex,
                (match, url) => url
            )

            const formData = new FormData()
            formData.append('notice_seq', notice_seq)
            formData.append('notice_title', notice.notice_title)
            formData.append('notice_contents', contentWithoutMarkdown) // URL로 대체된 내용 DB 저장

            console.log('FormData to be submitted:', {
                notice_seq,
                notice_title: notice.notice_title,
                notice_contents: contentWithoutMarkdown,
            })

            await modifyNtc(notice_seq, formData) // 수정 API 호출

            SwalComp({
                type: 'success',
                text: '공지사항이 수정되었습니다.',
            }).then(() => navigate('/admin/notice')) // 수정 후 목록으로 이동
        } catch (error) {
            console.error('공지사항 수정 실패:', error)
            SwalComp({ type: 'error', text: '공지사항 수정에 실패했습니다.' })
        }
    }

    // // 수정 완료 핸들러
    // const handleSubmit = async () => {
    //     try {
    //         const markdownContent = notice.notice_contents

    //         // 마크다운에서 이미지 URL 추출 (예: 첫 번째 이미지만 추출)
    //         const imageRegex = /!\[.*?\]\((.*?)\)/ // 마크다운 이미지 패턴
    //         const imageUrlMatch = markdownContent.match(imageRegex) // 이미지 URL 추출
    //         const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null // URL 추출, 없으면 null

    //         // 공지사항 내용을 이미지 URL로 교체 (이미지 마크다운을 URL로 변경)
    //         const contentWithoutMarkdown = markdownContent.replace(
    //             imageRegex,
    //             imageUrl || ''
    //         )

    //         const formData = new FormData()
    //         formData.append('notice_seq', notice_seq) // 공지사항 시퀀스
    //         formData.append('notice_title', notice.notice_title) // 공지사항 제목
    //         formData.append('notice_contents', contentWithoutMarkdown) // URL로 대체된 내용

    //         // 수정할 데이터 로그 (디버깅용)
    //         console.log('FormData to be submitted:', {
    //             notice_seq,
    //             notice_title: notice.notice_title,
    //             notice_contents: contentWithoutMarkdown,
    //         })

    //         // 수정 API 호출
    //         await modifyNtc(notice_seq, formData)
    //         console.log('수정할 공지사항 ID:', notice_seq)

    //         SwalComp({
    //             type: 'success',
    //             text: '공지사항이 수정되었습니다.',
    //         }).then(() => navigate('/notice')) // 수정 후 목록으로 이동
    //     } catch (error) {
    //         console.error('공지사항 수정 실패:', error)
    //         SwalComp({ type: 'error', text: '공지사항 수정에 실패했습니다.' })
    //     }
    // }

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <input
                    type="text"
                    placeholder="수정 할 공지사항 제목 을 입력해주세요"
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
