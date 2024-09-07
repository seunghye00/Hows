import React, { useState, useEffect } from 'react'
import styles from './Post.module.css'
import { host } from '../../../../config/config' // axios를 사용하여 API 호출
import axios from 'axios'

export const Post = () => {
    const [images, setImages] = useState([]) // 여러 이미지를 저장할 배열
    const MAX_IMAGE_SIZE_BYTES = 1024 * 1024 * 2
    const MAX_IMAGES = 5

    const [housingTypes, setHousingTypes] = useState([]) // 주거 형태 리스트
    const [spaceTypes, setSpaceTypes] = useState([]) // 공간 형태 리스트
    const [areaSizes, setAreaSizes] = useState([]) // 평수 리스트

    const [selectedHousingType, setSelectedHousingType] = useState('') // 선택된 주거 형태
    const [selectedSpaceType, setSelectedSpaceType] = useState('') // 선택된 공간 형태
    const [selectedAreaSize, setSelectedAreaSize] = useState('') // 선택된 평수

    // 이미지 파일 미리보기 및 추가
    const handleAddImage = event => {
        const files = event.target.files

        // 현재 추가된 이미지 개수 확인
        const currentImageCount = images.length

        // 최대 이미지를 넘기지 않도록 설정
        if (currentImageCount + files.length > MAX_IMAGES) {
            alert(`최대 ${MAX_IMAGES}개의 이미지만 업로드 가능합니다.`)
            return
        }

        // 선택된 파일들에 대한 처리를 수행
        const newImages = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            // 파일이 이미지가 아닌 경우 스킵
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드 가능합니다.')
                continue
            }

            // 파일 크기 제한 체크
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                alert('이미지 파일은 최대 2MB까지만 업로드 가능합니다.')
                continue
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setImages(prevImages => [...prevImages, reader.result]) // 이미지를 추가
            }
            reader.readAsDataURL(file) // 파일을 Data URL로 변환하여 미리보기
        }
    }

    // 이미지 삭제 처리
    const handleRemoveImage = index => {
        setImages(images.filter((_, i) => i !== index))
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const housingTypesResponse = await axios.get(
                    `${host}/option/housing-types`
                )
                setHousingTypes(housingTypesResponse.data)

                const spaceTypesResponse = await axios.get(
                    `${host}/option/space-types`
                )
                setSpaceTypes(spaceTypesResponse.data)

                const areaSizesResponse = await axios.get(
                    `${host}/option/area-size`
                )
                setAreaSizes(areaSizesResponse.data)
            } catch (error) {
                console.error('Error fetching data', error)
            }
        }

        fetchData()
    }, [])

    return (
        <div className={styles.community}>
            <div className={styles.writeTit}>게시글 작성</div>
            <div className={styles.writeWrap}>
                <div className={styles.imageUploader}>
                    {images.length === 0 && (
                        <div className={styles.emptyImageBox}>
                            <div className={styles.emptyTxt}>
                                <p>사진을 끌어다 놓으세요</p>
                                <p>최대 {MAX_IMAGES}장까지 올릴 수 있어요.</p>
                            </div>
                            <label className={styles.uploadButton}>
                                PC에서 불러오기
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleAddImage}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    )}

                    {images.length > 0 && (
                        <div className={styles.imagePreviewList}>
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={styles.imagePreview}
                                >
                                    <div className={styles.imageBox}>
                                        <img
                                            src={image}
                                            alt={`preview ${index}`}
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
                                            onChange={handleAddImage}
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
                </div>

                <div className={styles.txtBox}>
                    <div className={styles.selectBox}>
                        {/* 주거 형태 선택 */}
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

                        {/* 공간 선택 */}
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

                        {/* 평수 선택 */}
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
                    ></div>
                </div>
            </div>
        </div>
    )
}
