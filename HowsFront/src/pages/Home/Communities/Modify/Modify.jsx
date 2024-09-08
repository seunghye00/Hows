import React, { useState, useEffect } from 'react'
import styles from './Modify.module.css'
import { host } from '../../../../config/config'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../../components/Button/Button'

export const Modify = ({ postId }) => {
    const [images, setImages] = useState([]) // 여러 이미지를 저장할 배열
    const [thumbnail, setThumbnail] = useState(null) // 썸네일로 지정된 이미지
    const [content, setContent] = useState('') // 게시글 내용
    const MAX_IMAGE_SIZE_BYTES = 1024 * 1024 * 2
    const MAX_IMAGES = 5

    const [housingTypes, setHousingTypes] = useState([]) // 주거 형태 리스트
    const [spaceTypes, setSpaceTypes] = useState([]) // 공간 형태 리스트
    const [areaSizes, setAreaSizes] = useState([]) // 평수 리스트

    const [selectedHousingType, setSelectedHousingType] = useState('') // 선택된 주거 형태
    const [selectedSpaceType, setSelectedSpaceType] = useState('') // 선택된 공간 형태
    const [selectedAreaSize, setSelectedAreaSize] = useState('') // 선택된 평수

    // 게시글 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 서버에서 해당 게시글 데이터를 불러옴
                const response = await axios.get(`${host}/posts/${postId}`)
                const postData = response.data

                setImages(postData.images) // 이미지 설정
                setThumbnail(postData.thumbnail) // 썸네일 설정
                setContent(postData.content) // 게시글 내용 설정
                setSelectedHousingType(postData.housingType)
                setSelectedSpaceType(postData.spaceType)
                setSelectedAreaSize(postData.areaSize)
            } catch (error) {
                console.error('Error fetching post data', error)
            }
        }

        fetchData()
    }, [postId])

    // react-dropzone 설정
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/jpeg, image/png, image/gif', // 구체적인 이미지 형식만 허용
        onDrop: acceptedFiles => {
            if (images.length + acceptedFiles.length > MAX_IMAGES) {
                alert(`최대 ${MAX_IMAGES}개의 이미지만 업로드 가능합니다.`)
                return
            }

            acceptedFiles.forEach(file => {
                if (!file.type.startsWith('image/')) {
                    alert('이미지 파일만 업로드 가능합니다.')
                    return
                }

                if (file.size > MAX_IMAGE_SIZE_BYTES) {
                    alert('이미지 파일은 최대 2MB까지만 업로드 가능합니다.')
                    return
                }

                const reader = new FileReader()
                reader.onloadend = () => {
                    setImages(prevImages => [...prevImages, reader.result])
                }
                reader.readAsDataURL(file)
            })
        },
    })

    // 이미지 삭제 처리
    const handleRemoveImage = index => {
        setImages(images.filter((_, i) => i !== index))
        if (images[index] === thumbnail) {
            setThumbnail(null) // 썸네일 삭제 시 초기화
        }
    }

    // 드래그로 썸네일 설정
    const handleDropThumbnail = (e, image) => {
        e.preventDefault()
        setThumbnail(image)
    }

    const handleDragOver = e => {
        e.preventDefault()
    }

    // 게시글 수정 완료 처리
    const handleModify = async () => {
        try {
            // 수정된 데이터를 서버로 전송
            await axios.put(`${host}/posts/${postId}`, {
                images,
                thumbnail,
                content,
                housingType: selectedHousingType,
                spaceType: selectedSpaceType,
                areaSize: selectedAreaSize,
            })
            alert('게시글이 수정되었습니다.')
        } catch (error) {
            console.error('Error updating post', error)
        }
    }

    return (
        <div className={styles.community}>
            <div className={styles.writeTit}>게시글 수정</div>
            <div className={styles.writeWrap}>
                <div className={styles.imageUploader}>
                    {images.length === 0 && (
                        <div {...getRootProps({ className: styles.dropzone })}>
                            <input {...getInputProps()} />
                            <div className={styles.emptyImageBox}>
                                <p>
                                    드래그 앤 드롭하거나 클릭해서 이미지 업로드
                                    하세요.
                                </p>
                                <p>
                                    최대 {MAX_IMAGES}장까지 업로드 가능합니다.
                                </p>
                            </div>
                        </div>
                    )}

                    {images.length > 0 && (
                        <div className={styles.imagePreviewList}>
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={styles.imagePreview}
                                    draggable
                                    onDragStart={e =>
                                        e.dataTransfer.setData('image', image)
                                    }
                                >
                                    <div className={styles.imageBox}>
                                        <img
                                            src={image}
                                            alt={`preview ${index}`}
                                            className={
                                                thumbnail === image
                                                    ? styles.selectedThumbnail
                                                    : ''
                                            }
                                        />
                                    </div>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <i className="bx bxs-trash"></i>
                                    </button>
                                </div>
                            ))}
                            {images.length < MAX_IMAGES && (
                                <div className={styles.addImageBox}>
                                    <label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={getInputProps().onChange}
                                            style={{ display: 'none' }}
                                        />
                                        <div className={styles.addButton}>
                                            +
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {images.length > 0 && (
                        <div
                            className={styles.thumbnailCont}
                            onDrop={e =>
                                handleDropThumbnail(
                                    e,
                                    e.dataTransfer.getData('image')
                                )
                            }
                            onDragOver={handleDragOver}
                        >
                            {thumbnail ? (
                                <img
                                    src={thumbnail}
                                    alt="썸네일 프리뷰"
                                    className={styles.thumbnailPreview}
                                />
                            ) : (
                                <p>
                                    여기에 이미지를 드래그하여 썸네일로
                                    지정하세요
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.txtBox}>
                    <div className={styles.selectBox}>
                        <select
                            name="housingType"
                            value={selectedHousingType}
                            onChange={e =>
                                setSelectedHousingType(e.target.value)
                            }
                        >
                            <option value="">주거 형태 선택</option>
                            {housingTypes.map(type => (
                                <option
                                    key={type.housing_type_code}
                                    value={type.housing_type_code}
                                >
                                    {type.housing_type_title}
                                </option>
                            ))}
                        </select>

                        <select
                            name="spaceType"
                            value={selectedSpaceType}
                            onChange={e => setSelectedSpaceType(e.target.value)}
                        >
                            <option value="">공간 선택</option>
                            {spaceTypes.map(type => (
                                <option
                                    key={type.space_type_code}
                                    value={type.space_type_code}
                                >
                                    {type.space_type_title}
                                </option>
                            ))}
                        </select>

                        <select
                            name="areaSize"
                            value={selectedAreaSize}
                            onChange={e => setSelectedAreaSize(e.target.value)}
                        >
                            <option value="">평수 선택</option>
                            {areaSizes.map(size => (
                                <option
                                    key={size.area_size_code}
                                    value={size.area_size_code}
                                >
                                    {size.area_size_title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div
                        className={styles.txtWriteBox}
                        contentEditable="true"
                        data-placeholder="내용을 입력해주세요"
                        onInput={e => setContent(e.currentTarget.textContent)}
                    >
                        {content || ''}
                    </div>

                    <div className={styles.postBtn}>
                        <Button
                            size="s"
                            title="수정완료"
                            onClick={handleModify}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
