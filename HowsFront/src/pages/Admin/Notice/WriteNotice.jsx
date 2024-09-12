import styles from './WriteNotice.module.css'
import { Button } from '../../../components/Button/Button'
import { useState } from 'react'
import { SwalComp } from '../../../commons/commons'
import { EditorComp } from '../../../components/Editor/Editor'
import { useNavigate } from 'react-router-dom'
import { insertNtc } from '../../../api/notice'
import { uploadFile } from '../../../api/file'

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

    // 에디터 내용 변경 핸들러 (이미지가 base64로 들어오는지 체크하고 URL로 대체)
    const handleEditorChange = async content => {
        console.log('에디터 내용 변경됨:', content) // 에디터에서 전달된 내용을 출력

        // base64 형식의 이미지가 포함된 공지사항 내용을 처리
        if (content.includes('data:image/')) {
            console.log('Base64 이미지가 포함된 내용을 처리합니다.')

            const updatedContent = await processImagesInContent(content)

            console.log('변환된 내용 (Base64 -> URL):', updatedContent) // 변환된 내용을 출력

            setNotice(prev => ({
                ...prev,
                notice_contents: updatedContent, // Base64가 아닌 URL로 대체된 내용을 저장
            }))
        } else {
            console.log(
                'Base64 이미지가 포함되지 않은 내용을 그대로 저장합니다.'
            )

            setNotice(prev => ({
                ...prev,
                notice_contents: content, // Base64 이미지가 없는 경우 그대로 저장
            }))
        }
    }

    // base64 이미지를 URL로 대체하는 함수
    const processImagesInContent = async content => {
        console.log('Base64 이미지를 찾아서 처리 중:', content)

        const regex = /!\[.*?\]\((data:image\/[^;]+;base64,[^)]+)\)/g // 이미지의 base64 패턴 찾기
        let updatedContent = content
        const matches = [...content.matchAll(regex)]

        console.log('찾은 Base64 이미지들:', matches) // Base64 이미지를 찾은 결과를 출력

        for (const match of matches) {
            const base64Image = match[1]
            console.log('처리 중인 Base64 이미지:', base64Image) // 처리 중인 Base64 이미지를 출력

            const fileBlob = base64ToBlob(base64Image) // Base64 데이터를 Blob으로 변환

            console.log('Blob으로 변환된 이미지:', fileBlob) // 변환된 Blob 객체를 출력

            // 이미지 업로드 후 URL로 대체
            const imageUrl = await uploadFileToServer(fileBlob)
            if (imageUrl) {
                console.log('이미지 업로드 성공, URL:', imageUrl) // 업로드된 이미지 URL을 출력
                updatedContent = updatedContent.replace(
                    `![](${base64Image})`,
                    imageUrl
                ) // 단순 URL로 대체
            } else {
                console.log('이미지 업로드 실패.') // 이미지 업로드 실패 시 출력
            }
        }

        console.log('최종 변환된 내용:', updatedContent) // 최종 변환된 본문 내용을 출력
        return updatedContent
    }

    // Base64 이미지를 Blob으로 변환하는 함수
    const base64ToBlob = base64Data => {
        const byteString = atob(base64Data.split(',')[1]) // Base64 데이터를 디코딩
        const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0] // MIME 타입 추출

        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }

        return new Blob([ab], { type: mimeString })
    }

    // 서버에 파일 업로드 함수
    const uploadFileToServer = async blob => {
        const formData = new FormData()
        formData.append('file', blob)

        try {
            console.log('파일 업로드 시작, Blob 정보:', blob) // 업로드 시작 로그 추가

            const response = await uploadFile(formData) // 업로드 API 호출
            console.log('서버 응답:', response)

            if (response.status === 200 && response.data) {
                const imageUrl = response.data // 여기에 명확히 URL을 할당
                console.log('GCS 업로드 성공:', imageUrl) // 성공 시 이미지 URL 반환
                return imageUrl // 서버에서 반환된 이미지 URL 반환
            } else {
                console.error('이미지 업로드 실패, 상태 코드:', response.status)
                throw new Error('이미지 업로드 실패')
            }
        } catch (error) {
            console.error('이미지 업로드 중 오류:', error.message)
            SwalComp({ type: 'error', text: '이미지 업로드 실패' })
            return null
        }
    }

    // 작성 완료 핸들러
    const handleSubmit = () => {
        if (!notice.notice_title || !notice.notice_contents) {
            SwalComp({
                type: 'warning',
                text: '모든 필드를 입력해주세요.',
            })
            return
        }

        const formData = new FormData()
        formData.append('notice_title', notice.notice_title)
        formData.append('notice_contents', notice.notice_contents) // 이미지 URL이 포함된 내용 전달

        console.log('공지사항 업로드 시작', formData)

        // 서버에 데이터를 전송하는 로직
        insertNtc(formData)
            .then(resp => {
                SwalComp({
                    type: 'success',
                    text: '공지사항이 추가되었습니다.',
                }).then(() => navigate('/notice'))
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
                    navigate('/notice')
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
                    />
                </div>
            </div>
        </>
    )
}
