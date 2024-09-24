import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { detailEvt, modifyEvt } from '../../../../api/event'
import { Button } from '../../../../components/Button/Button'
import { SwalComp } from '../../../../commons/commons'
import { EditorComp } from '../../../../components/Editor/Editor'
import styles from './ModifyEvent.module.css'

export const ModifyEvent = () => {
    const { event_seq } = useParams() // URL에서 event_seq를 가져옴
    const [event, setEvent] = useState({
        event_title: '',
        event_contents: '',
    })
    const navigate = useNavigate()

    // 수정할 이벤트 데이터를 불러옴
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await detailEvt(event_seq)
                const eventData = response.data

                // 이미지 URL 패턴을 찾아서 변환
                const markdownContent = eventData.event_contents
                const imageRegex = /(https:\/\/.*?)(\s|$)/g // 이미지 URL을 추출하는 정규 표현식
                const markdownWithImages = markdownContent.replace(
                    imageRegex,
                    '![이미지 설명]($1)'
                )

                // 변환된 내용을 상태로 설정
                setEvent({
                    event_title: eventData.event_title,
                    event_contents: markdownWithImages, // 텍스트는 그대로, 이미지 URL은 마크다운 형식으로 변경
                })
            } catch (error) {
                console.error('이벤트 불러오기 실패:', error)
            }
        }

        fetchEventDetails()
    }, [event_seq])

    // 입력 필드 변경 핸들러
    const handleInputChange = e => {
        const { name, value } = e.target
        console.log(`Input field changed: ${name} = ${value}`) // 필드 변경 로그
        setEvent(prev => ({ ...prev, [name]: value }))
    }

    // 에디터 내용 변경 핸들러
    const handleEditorChange = content => {
        console.log('Editor content changed:', content) // 에디터 내용 변경 로그
        setEvent(prev => ({ ...prev, event_contents: content }))
    }

    // 수정 완료 핸들러
    const handleSubmit = async () => {
        try {
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

            // 이미지 URL만 추출하여 변환
            const imageRegex = /!\[.*?\]\((.*?)\)/g
            const contentWithoutMarkdown = markdownContent.replace(
                imageRegex,
                (match, url) => url
            )

            const formData = new FormData()
            formData.append('event_seq', event_seq)
            formData.append('event_title', event.event_title)
            formData.append('event_contents', contentWithoutMarkdown) // URL로 대체된 내용 DB 저장

            console.log('FormData to be submitted:', {
                event_seq,
                event_title: event.event_title,
                event_contents: contentWithoutMarkdown,
            })

            await modifyEvt(event_seq, formData) // 수정 API 호출

            SwalComp({
                type: 'success',
                text: '이벤트가 수정되었습니다.',
            }).then(() => navigate('/admin/notice/event')) // 수정 후 목록으로 이동
        } catch (error) {
            console.error('이벤트 수정 실패:', error)
            SwalComp({ type: 'error', text: '이벤트 수정에 실패했습니다.' })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <input
                    type="text"
                    placeholder="수정 할 이벤트 제목을 입력해주세요"
                    name="event_title"
                    value={event.event_title} // 불러온 데이터를 입력 필드에 적용
                    onChange={handleInputChange}
                />
            </div>
            <div className={styles.writeWrap}>
                <EditorComp
                    onChange={handleEditorChange}
                    contents={event.event_contents} // 에디터의 초기값을 불러온 데이터로 설정
                />
            </div>
            <div className={styles.btns}>
                <Button size={'s'} title={'완료'} onClick={handleSubmit} />
                <Button
                    size={'s'}
                    title={'취소'}
                    onClick={() => navigate('/admin/notice/event')}
                />
            </div>
        </div>
    )
}
