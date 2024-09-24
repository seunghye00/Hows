import styles from './WriteNotice.module.css'
import { Button } from '../../../components/Button/Button'
import { useState } from 'react'
import { SwalComp } from '../../../commons/commons'
import { EditorComp } from '../../../components/Editor/Editor'
import { useNavigate } from 'react-router-dom'
import { insertNtc } from '../../../api/notice'

export const WriteNotice = () => {
    const [notice, setNotice] = useState({
        notice_title: '', // 공지사항 제목
        notice_contents: '', // 공지사항 내용
    })

    const navigate = useNavigate()

    // 입력 필드 변경 핸들러
    const handleInputChange = e => {
        const { name, value } = e.target
        setNotice(prev => ({ ...prev, [name]: value }))
    }

    // 에디터 내용 변경 핸들러
    const handleEditorChange = content => {
        setNotice(prev => ({
            ...prev,
            notice_contents: content, // 에디터에서 변경된 내용을 그대로 저장
        }))
    }

    // 작성 완료 핸들러
    const handleSubmit = () => {
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
        formData.append('notice_title', notice.notice_title)
        formData.append('notice_contents', contentWithoutMarkdown) // 마크다운 이미지 문법이 제거되고 URL만 저장

        insertNtc(formData)
            .then(resp => {
                SwalComp({
                    type: 'success',
                    text: '공지사항이 추가되었습니다.',
                }).then(() => navigate('/admin/notice'))
            })
            .catch(error => {
                SwalComp({
                    type: 'error',
                    text: '공지사항 업로드에 실패했습니다.',
                })
            })
    }

    // 작성 취소 핸들러
    const handleCancel = () => {
        SwalComp({ type: 'confirm', text: '작성을 취소하시겠습니까 ?' }).then(
            result => {
                if (result.isConfirmed) {
                    navigate('/admin/notice')
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
                        placeholder="공지사항 제목을 입력해주세요"
                        name="notice_title"
                        onChange={handleInputChange} // 제목 입력 변경 시 콘솔 출력
                    />
                </div>
                <div className={styles.writeWrap}>
                    <EditorComp
                        onChange={handleEditorChange} // 에디터 내용 변경 핸들러
                        contents={notice.notice_contents} // 에디터의 초기값 설정
                    />
                </div>
            </div>
        </>
    )
}
