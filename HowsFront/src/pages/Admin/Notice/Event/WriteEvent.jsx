import styles from './WriteEvent.module.css'
import { Button } from '../../../../components/Button/Button'
import { useState } from 'react'
import { SwalComp } from '../../../../commons/commons'
import { EditorComp } from '../../../../components/Editor/Editor'
import { useNavigate } from 'react-router-dom'
import { insertEvt } from '../../../../api/event'

export const WriteEvent = () => {
    const [event, setEvent] = useState({
        event_title: '', // 이벤트 제목
        event_contents: '', // 이벤트 내용
    })

    const navigate = useNavigate()

    // 입력 필드 변경 핸들러
    const handleInputChange = e => {
        const { name, value } = e.target
        setEvent(prev => ({ ...prev, [name]: value }))
    }

    // 에디터 내용 변경 핸들러
    const handleEditorChange = content => {
        setEvent(prev => ({
            ...prev,
            event_contents: content, // 에디터에서 변경된 내용을 그대로 저장
        }))
    }

    // 작성 완료 핸들러
    const handleSubmit = () => {
        const { event_title, event_contents } = event

        // 제목 또는 내용이 비어있는 경우 경고 메시지 표시
        if (!event_title.trim()) {
            SwalComp({
                type: 'error',
                text: '제목을 입력하세요.',
            })
            return
        }

        if (!event_contents.trim()) {
            SwalComp({
                type: 'error',
                text: '내용을 입력하세요.',
            })
            return
        }

        const markdownContent = event.event_contents

        // 마크다운에서 모든 이미지 URL 추출
        const imageRegex = /!\[.*?\]\((.*?)\)/g
        const imageUrlMatches = Array.from(markdownContent.matchAll(imageRegex))

        // 모든 이미지 URL을 추출하여 배열로 저장
        const imageUrls = imageUrlMatches.map(match => match[1])

        // 공지사항 내용을 마크다운 이미지 문법을 제거하고 URL로 대체
        let contentWithoutMarkdown = markdownContent.replace(
            imageRegex,
            (_, url) => url
        )

        // 최종적으로 DB에 저장될 내용
        const formData = new FormData()
        formData.append('event_title', event.event_title)
        formData.append('event_contents', contentWithoutMarkdown) // URL로 대체된 내용을 DB에 저장

        insertEvt(formData)
            .then(resp => {
                SwalComp({
                    type: 'success',
                    text: '이벤트가 추가되었습니다.',
                }).then(() => navigate('/admin/notice/event'))
            })
            .catch(error => {
                SwalComp({
                    type: 'error',
                    text: '이벤트 업로드에 실패했습니다.',
                })
            })
    }

    // 작성 취소 핸들러
    const handleCancel = () => {
        SwalComp({ type: 'confirm', text: '작성을 취소하시겠습니까?' }).then(
            result => {
                if (result.isConfirmed) {
                    navigate('/admin/notice/event')
                }
            }
        )
    }

    return (
        <>
            <div className={styles.btns}>
                <Button size={'s'} title={'완료'} onClick={handleSubmit} />
                <Button size={'s'} title={'취소'} onClick={handleCancel} />
            </div>
            <div className={styles.container}>
                <div className={styles.info}>
                    <input
                        type="text"
                        placeholder="이벤트 제목을 입력해주세요"
                        name="event_title"
                        onChange={handleInputChange} // 제목 입력 변경 시 콘솔 출력
                    />
                </div>
                <div className={styles.writeWrap}>
                    <EditorComp
                        onChange={handleEditorChange} // 에디터 내용 변경 핸들러
                        contents={event.event_contents} // 에디터의 초기값 설정
                    />
                </div>
            </div>
        </>
    )
}
