import React, { useEffect, useRef } from 'react'
import { Editor } from '@toast-ui/editor'
import { uploadFile } from '../../api/file'
import '@toast-ui/editor/dist/toastui-editor.css' // CSS import
import styles from './Editor.module.css' // CSS 모듈 import

export const EditorComp = () => {
    const editorRef = useRef(null)

    useEffect(() => {
        if (editorRef.current) {
            const editorInstance = new Editor({
                el: editorRef.current,
                height: '100%',
                initialEditType: 'wysiwyg',
                previewStyle: 'vertical',
                customImageUploadHandler: file => {
                    // 파일을 서버에 업로드하고 URL을 반환하는 로직
                    const formData = new FormData()
                    formData.append('file', file)
                    console.log('함수 실행')
                    uploadFile(formData)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('파일 업로드 실패')
                            }
                            return response.json()
                        })
                        .then(result => {
                            const imageUrl = result.url // 서버에서 반환된 이미지 URL
                            // 에디터에 이미지 URL 삽입
                            editorInstance.insertImage({ src: imageUrl })
                        })
                        .catch(error => {
                            console.error('이미지 업로드 중 오류 발생:', error)
                        })
                },
            })

            // 컴포넌트가 언마운트될 때 정리
            return () => {
                editorInstance.destroy() // 에디터 인스턴스 제거
            }
        }
    }, []) // 빈 배열로 인해 마운트 시에만 실행

    return (
        <div className={styles.container}>
            <div ref={editorRef} className={styles.editor}></div>
        </div>
    )
}
