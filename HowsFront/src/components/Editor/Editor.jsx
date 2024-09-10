import React, { useEffect, useRef } from 'react'
import { Editor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css' // CSS import
import styles from './Editor.module.css' // CSS 모듈 import

export const EditorComp = () => {
    const editorRef = useRef(null)

    useEffect(() => {
        // Editor 인스턴스 초기화
        const editorInstance = new Editor({
            el: editorRef.current,
            height: '100%',
            initialEditType: 'wysiwyg',
            previewStyle: 'vertical',
        })

        // 컴포넌트가 언마운트될 때 정리
        return () => {
            editorInstance.remove() // 에디터 인스턴스 제거
        }
    }, []) // 빈 배열로 인해 마운트 시에만 실행

    return (
        <div className={styles.container}>
            <div ref={editorRef}></div>
        </div>
    )
}
