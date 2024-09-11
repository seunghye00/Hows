import styles from './WriteNotice.module.css'
import { Button } from '../../../components/Button/Button'
import { BiCamera } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { SwalComp } from '../../../commons/commons'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa' // 체크박스 아이콘
import { EditorComp } from '../../../components/Editor/Editor'
import { useNavigate } from 'react-router-dom'

export const WriteNotice = () => {
    const [selectedFiles, setSelectedFiles] = useState([]) // 이미지 파일 리스트
    const [previews, setPreviews] = useState([]) // 이미지 미리보기 리스트
    const [selectedImage, setSelectedImage] = useState(0) // 대표 이미지 인덱스
    const [notice, setNotice] = useState({
        notice_title: '', // 공지사항 제목
        notice_contents: '', // 공지사항 내용
    })

    const navigate = useNavigate()

    const handleFileChange = e => {
        const files = Array.from(e.target.files)

        if (files.length + selectedFiles.length > 10) {
            SwalComp({
                type: 'warning',
                text: '최대 10개의 파일만 업로드할 수 있습니다.',
            })
            return
        }

        const newFiles = files.filter(file => file.type.startsWith('image/'))
        if (newFiles.length !== files.length) {
            SwalComp({
                type: 'warning',
                text: '이미지 파일만 선택 가능합니다.',
            })
            return
        }

        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles])

        const newPreviews = newFiles.map(file => URL.createObjectURL(file))
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviews])
    }

    const handleDeletePreview = index => {
        setPreviews(prevPreviews => {
            const newPreviews = prevPreviews.filter((_, i) => i !== index)
            return newPreviews
        })

        // 선택된 파일도 제거
        setSelectedFiles(prevFiles => {
            const newFiles = prevFiles.filter((_, i) => i !== index)
            return newFiles
        })

        // 미리보기 URL 해제
        URL.revokeObjectURL(previews[index])
    }

    // 대표 사진 선택
    const handleSelectImage = index => {
        setSelectedImage(index)
    }

    // 공지사항 제목 및 내용 입력 핸들러
    const handleInputChange = e => {
        const { name, value } = e.target
        setNotice(prev => ({ ...prev, [name]: value }))
    }

    // 작성 완료
    const handleSubmit = () => {
        if (selectedImage === 10) {
            SwalComp({
                type: 'warning',
                text: '대표 사진을 등록해주세요.',
            })
            return
        }

        if (!notice.notice_title || !notice.notice_contents) {
            SwalComp({
                type: 'warning',
                text: '모든 필드를 입력해주세요.',
            })
            return
        }

        const formData = new FormData()
        formData.append('notice_title', notice.notice_title)
        formData.append('notice_contents', notice.notice_contents)

        selectedFiles.forEach(file => {
            formData.append('images', file, file.name)
        })

        // 대표 이미지가 선택된 경우
        formData.append('thumbNailIndex', selectedImage) // selectedImage의 index만 전송

        // 서버에 데이터를 전송하는 로직 (서버에 맞는 API 호출 필요)
        // 예: addNotice(formData)
        /*
        addNotice(formData)
            .then(resp => {
                SwalComp({
                    type: 'success',
                    text: '공지사항이 추가되었습니다.',
                }).then(navigate('/admin/notice'))
            })
            .catch(error => {
                console.error('업로드 실패 :', error)
                SwalComp({
                    type: 'error',
                    text: '공지사항 업로드에 실패했습니다.',
                })
            })
        */
    }

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
                <div className={styles.imgs}>
                    <span className={styles.addBtn}>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            multiple
                        />
                        <label htmlFor="image">
                            <BiCamera size={40} />
                        </label>
                        <div className={styles.imgNum}>
                            <span>{selectedFiles.length}</span> / 10
                        </div>
                    </span>
                    {previews.map((preview, index) => (
                        <div className={styles.addedImg} key={index}>
                            <img src={preview} alt={`Preview ${index}`} />
                            <button
                                className={styles.delBtn}
                                onClick={() => handleDeletePreview(index)}
                            >
                                &times;
                            </button>
                            <button
                                className={styles.selectBtn}
                                onClick={() => handleSelectImage(index)}
                            >
                                {selectedImage === index ? (
                                    <FaCheckSquare size={24} color="green" />
                                ) : (
                                    <FaRegSquare size={24} color="gray" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                <div className={styles.info}>
                    <input
                        type="text"
                        placeholder="공지사항 제목을 입력해주세요"
                        name="notice_title"
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.writeWrap}>
                    <EditorComp
                        onChange={content =>
                            setNotice(prev => ({
                                ...prev,
                                notice_contents: content,
                            }))
                        }
                    />
                </div>
            </div>
        </>
    )
}
