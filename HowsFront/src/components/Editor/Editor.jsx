import React, { useEffect, useRef } from 'react'
import { Editor } from '@toast-ui/editor'
import { uploadFile } from '../../api/file'
import '@toast-ui/editor/dist/toastui-editor.css' // CSS import
import styles from './Editor.module.css' // CSS 모듈 import

export const EditorComp = ({ onChange, contents }) => {
    const editorRef = useRef(null)
    const editorInstanceRef = useRef(null) // 에디터 인스턴스를 저장할 ref

    useEffect(() => {
        if (editorRef.current) {
            editorInstanceRef.current = new Editor({
                el: editorRef.current,
                height: '100%',
                initialEditType: 'wysiwyg',
                previewStyle: 'vertical',
                initialValue: contents || '', // 초기 콘텐츠 설정
                events: {
                    change: () => {
                        const content = editorInstanceRef.current.getMarkdown()
                        onChange(content) // 에디터 내용이 변경될 때마다 부모 컴포넌트로 전달
                    },
                },
                hooks: {
                    addImageBlobHook: (blob, callback) => {
                        // Blob인지 File인지 확인
                        if (blob instanceof Blob || blob instanceof File) {
                            const formData = new FormData()
                            formData.append('file', blob) // 파일 업로드

                            console.log('파일 업로드 시작')

                            uploadFile(formData)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('파일 업로드 실패')
                                    }
                                    return response.json()
                                })
                                .then(result => {
                                    const imageUrl = result.url // 서버에서 반환된 이미지 URL
                                    callback(imageUrl, '이미지 설명') // 에디터에 이미지 URL 삽입
                                })
                                .catch(error => {
                                    console.error(
                                        '이미지 업로드 중 오류 발생:',
                                        error
                                    )
                                })
                        } else {
                            console.error(
                                '업로드된 파일이 Blob 또는 File 타입이 아닙니다:',
                                blob
                            )
                        }
                    },
                },
            })

            // 컴포넌트가 언마운트될 때 에디터 인스턴스 정리
            return () => {
                if (editorInstanceRef.current) {
                    editorInstanceRef.current.destroy() // 에디터 인스턴스 제거
                    editorInstanceRef.current = null // 참조 제거
                }
            }
        }
    }, []) // 빈 배열로 한 번만 실행 (editorRef.current가 변경될 때)

    // contents prop이 변경될 때마다 에디터에 새로운 내용을 설정
    useEffect(() => {
        if (editorInstanceRef.current && contents !== undefined) {
            editorInstanceRef.current.setMarkdown(contents)
        }
    }, [contents]) // contents가 변경될 때마다 실행

    return (
        <div className={styles.container}>
            <div ref={editorRef} className={styles.editor}></div>
        </div>
    )
}
