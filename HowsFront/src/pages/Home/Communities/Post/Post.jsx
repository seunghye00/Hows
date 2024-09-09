import React, { useState, useRef, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './Post.module.css'
import { Button } from '../../../../components/Button/Button'
import { Search } from '../../../../components/Search/Search'
import Swal from 'sweetalert2'
import { useDropzone } from 'react-dropzone'
import { Modal } from '../../../../components/Modal/Modal'
import axios from 'axios'
import { host } from '../../../../config/config'
import img from '../../../../assets/images/패브릭.png'
import img1 from '../../../../assets/images/수납.png'
import img2 from '../../../../assets/images/조명.png'
import img3 from '../../../../assets/images/주방용품.png'
import img4 from '../../../../assets/images/테스트.jpg'
// 이미지 순서 변경을 위한 타입
const ItemType = 'IMAGE'

export const Post = () => {
    const [images, setImages] = useState([]) // 여러 이미지를 저장할 배열
    const [thumbnail, setThumbnail] = useState(null) // 썸네일로 지정된 이미지
    const [isModalOpen, setIsModalOpen] = useState(false) // 상품 태그 모달
    const [isEditingTags, setIsEditingTags] = useState(false) // 태그 편집 상태
    const [selectedImageIndex, setSelectedImageIndex] = useState(0) // 태그 모달을 연 이미지의 인덱스
    const [tagPosition, setTagPosition] = useState({}) // 태그 위치 저장
    const [searchTerm, setSearchTerm] = useState('') // 검색어
    const [searchResults, setSearchResults] = useState([
        {
            product_seq: 1,
            product_thumbnail: img,
            name: 'Hows 스테인리스 철제 프레임 데스크',
        },
        {
            product_seq: 2,
            product_thumbnail: img1,
            name: 'Hows 철제 프레임 의자',
        },
        { product_seq: 3, product_thumbnail: img2, name: 'Hows 나무 책상' },
        { product_seq: 4, product_thumbnail: img3, name: 'Hows 철제 책상' },
        { product_seq: 4, product_thumbnail: img4, name: 'Hows 조명' },
    ]) // 임시 상품 태그 데이터
    // 기존 state와 함수 유지
    const [postContent, setPostContent] = useState('') // 글 내용
    const MAX_IMAGE_SIZE_BYTES = 1024 * 1024 * 2
    const MAX_IMAGES = 5
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

    const [housingTypes, setHousingTypes] = useState([])
    const [spaceTypes, setSpaceTypes] = useState([])
    const [areaSizes, setAreaSizes] = useState([])

    const [selectedHousingType, setSelectedHousingType] = useState('')
    const [selectedSpaceType, setSelectedSpaceType] = useState('')
    const [selectedAreaSize, setSelectedAreaSize] = useState('')

    // 좌표를 퍼센트로 변환하는 함수
    const convertToPercent = (x, y, imgWidth, imgHeight) => {
        const leftPercent = (x / imgWidth) * 100
        const topPercent = (y / imgHeight) * 100
        return { left: leftPercent, top: topPercent }
    }

    // 이미지 드롭존 설정
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            const validFiles = acceptedFiles.filter(file => {
                const fileExtension = file.name.split('.').pop().toLowerCase()
                const isValidExtension = validExtensions.includes(fileExtension)
                const isValidMimeType = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                ].includes(file.type)
                const isValidSize = file.size <= MAX_IMAGE_SIZE_BYTES

                if (!isValidExtension || !isValidMimeType) {
                    Swal.fire({
                        icon: 'error',
                        title: '파일 오류',
                        text: `${file.name}은 유효하지 않은 파일 형식입니다.`,
                    })
                    return false
                }

                if (!isValidSize) {
                    Swal.fire({
                        icon: 'warning',
                        title: '파일 용량 초과',
                        text: `${file.name}은 2MB보다 큽니다.`,
                    })
                    return false
                }

                return true
            })

            validFiles.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImages(prevImages => {
                        const updatedImages = [
                            ...prevImages,
                            { src: reader.result, tags: [], positions: [] },
                        ]
                        if (prevImages.length === 0) {
                            setThumbnail(reader.result)
                            setSelectedImageIndex(0) // 첫 번째 이미지를 기본 선택
                        }
                        return updatedImages
                    })
                }
                reader.readAsDataURL(file)
            })
        },
    })

    // 이미지 순서 변경 기능
    const moveImage = (dragIndex, hoverIndex) => {
        setImages(prevImages => {
            const updatedImages = [...prevImages]
            const [removed] = updatedImages.splice(dragIndex, 1)
            updatedImages.splice(hoverIndex, 0, removed)

            if (thumbnail === prevImages[dragIndex].src) {
                setThumbnail(updatedImages[hoverIndex].src) // 순서 변경된 이미지의 썸네일 유지
                setSelectedImageIndex(hoverIndex)
            }

            return updatedImages
        })
    }

    // 썸네일 설정
    const handleSetThumbnail = (imageSrc, index) => {
        setThumbnail(imageSrc)
        setSelectedImageIndex(index) // 상품 태그 모달에서 사용할 인덱스 설정
    }

    // 이미지 삭제 처리
    const handleRemoveImage = index => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)

        if (thumbnail === images[index]?.src) {
            setThumbnail(updatedImages[0]?.src || null)
            setSelectedImageIndex(0)
        }
    }

    // 상품 검색 핸들러
    const handleSearch = () => {
        setSearchResults(searchResults)
    }

    // 상품 태그 추가 핸들러
    const handleAddTag = product => {
        const updatedImages = [...images]
        updatedImages[selectedImageIndex].tags.push({
            product,
            position: tagPosition,
        })
        setImages(updatedImages)
        Swal.fire({
            icon: 'success',
            title: '상품 태그 추가 완료',
            text: `${product.name}이(가) 태그로 추가되었습니다.`,
        })
        setIsModalOpen(false) // 태그 추가 후 모달 닫기
    }

    // 태그 위치 지정 후 상품 태그 모달 열기
    const handleThumbnailClick = e => {
        if (isEditingTags && selectedImageIndex !== null) {
            const rect = e.target.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const imgWidth = rect.width
            const imgHeight = rect.height

            const { left, top } = convertToPercent(x, y, imgWidth, imgHeight)

            setTagPosition({ left, top })
            console.log(`태그 추가됨, 위치: Left: ${left}%, Top: ${top}%`) // 콘솔에 위치값 출력
            setIsModalOpen(true) // 상품 태그 선택 모달 열기
        }
    }

    // 태그 편집 완료 처리
    const handleFinishEditingTags = () => {
        setIsEditingTags(false)
    }

    // 태그 삭제 처리
    const handleDeleteTag = (tagIndex, productName) => {
        Swal.fire({
            title: `태그 삭제: ${productName}`,
            text: '태그를 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                const updatedImages = [...images]
                updatedImages[selectedImageIndex].tags.splice(tagIndex, 1)
                setImages(updatedImages)
                Swal.fire('태그가 삭제되었습니다.', '', 'success')
            }
        })
    }

    // 태그를 이미지 위에 표시하는 컴포넌트
    const renderTagMarkers = () => {
        return images[selectedImageIndex]?.tags.map((tag, i) => (
            <div
                key={i}
                className={styles.tagMarker}
                style={{
                    position: 'absolute',
                    left: `${tag.position.left}%`,
                    top: `${tag.position.top}%`,
                    margin: '-9px 0 0 -9px',
                }}
                onClick={() => handleDeleteTag(i, tag.product.name)} // 상품명도 함께 표시
            >
                <i className="bx bx-plus"></i>
            </div>
        ))
    }

    // 이미지 렌더링 컴포넌트
    const Image = ({ image, index, moveImage }) => {
        const ref = useRef(null)
        const [, drop] = useDrop({
            accept: ItemType,
            hover: (item, monitor) => {
                const dragIndex = item.index
                const hoverIndex = index
                if (dragIndex === hoverIndex) return
                const hoverBoundingRect = ref.current?.getBoundingClientRect()
                const hoverMiddleY =
                    (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
                const clientOffset = monitor.getClientOffset()
                const hoverClientY = clientOffset.y - hoverBoundingRect.top
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
                    return
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
                    return
                moveImage(dragIndex, hoverIndex)
                item.index = hoverIndex
            },
        })

        const [{ isDragging }, drag] = useDrag({
            type: ItemType,
            item: { index },
            collect: monitor => ({
                isDragging: monitor.isDragging(),
            }),
        })

        drag(drop(ref))

        return (
            <div
                ref={ref}
                className={styles.imagePreview}
                style={{ opacity: isDragging ? 0.5 : 1 }}
            >
                <div className={styles.imageBox}>
                    <img
                        src={image.src}
                        alt={`preview ${index}`}
                        onClick={() => handleSetThumbnail(image.src, index)} // 썸네일 변경
                    />
                </div>
                <button
                    className={styles.deleteButton}
                    onClick={() => handleRemoveImage(index)}
                >
                    <i className="bx bxs-trash"></i>
                </button>
            </div>
        )
    }

    // 정렬 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const housingTypesResponse = await axios.get(
                    `${host}/option/housing-types`
                )
                setHousingTypes(housingTypesResponse.data)
                console.log(housingTypesResponse.data)

                const spaceTypesResponse = await axios.get(
                    `${host}/option/space-types`
                )
                setSpaceTypes(spaceTypesResponse.data)

                const areaSizesResponse = await axios.get(
                    `${host}/option/area-sizes`
                )
                setAreaSizes(areaSizesResponse.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    // 게시글 작성 완료 처리 핸들러
    const handleSubmitPost = async () => {
        try {
            // 1. 게시글 정보를 먼저 전송
            const postData = {
                housing_type_code: selectedHousingType, // 선택된 주거 형태 코드
                space_type_code: selectedSpaceType, // 선택된 공간 타입 코드
                area_size_code: selectedAreaSize, // 선택된 평수 코드
                board_contents: postContent, // 작성한 글 내용
                member_id: 'qwer1234',
            }

            const response = await axios.post(`${host}/community`, postData)
            console.log(images)
            if (response.status === 200) {
                const { board_seq } = response.data // 게시글 번호 받아오기

                // 2. 이미지 및 태그 정보 전송
                await Promise.all(
                    images.map((image, index) => {
                        const imageData = {
                            board_seq: board_seq, // 받아온 게시글 번호
                            image_url: image.src, // 이미지 URL 또는 base64
                            image_order: index + 1, // 이미지 순서
                            tags: image.tags, // 해당 이미지에 대한 태그 정보
                        }
                        return axios.post(`${host}/community/images`, imageData)
                    })
                )

                Swal.fire({
                    icon: 'success',
                    title: '게시글 작성 완료',
                    text: '게시글과 이미지가 성공적으로 작성되었습니다.',
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '작성 실패',
                    text: '게시글 작성 중 문제가 발생했습니다.',
                })
            }
        } catch (error) {
            console.error('게시글 작성 오류:', error)
            Swal.fire({
                icon: 'error',
                title: '작성 실패',
                text: '서버와의 통신 중 오류가 발생했습니다.',
            })
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.community}>
                <div className={styles.writeTit}>게시글 작성</div>
                <div className={styles.writeWrap}>
                    <div className={styles.imageUploader}>
                        {images.length === 0 && (
                            <div
                                {...getRootProps({
                                    className: styles.dropzone,
                                })}
                            >
                                <input {...getInputProps()} />
                                <div className={styles.emptyImageBox}>
                                    <p>
                                        드래그 앤 드롭하거나 클릭해서 이미지
                                        업로드 하세요.
                                    </p>
                                    <p>
                                        최대 {MAX_IMAGES}장까지 업로드
                                        가능합니다.
                                    </p>
                                </div>
                            </div>
                        )}
                        {images.length > 0 && (
                            <div className={styles.imagePreviewList}>
                                {images.map((image, index) => (
                                    <Image
                                        key={index}
                                        index={index}
                                        image={image}
                                        moveImage={moveImage}
                                    />
                                ))}
                                {images.length < MAX_IMAGES && (
                                    <div
                                        {...getRootProps({
                                            className: styles.addImageBox,
                                        })}
                                    >
                                        <input {...getInputProps()} />
                                        <div className={styles.addButton}>
                                            +
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {thumbnail && (
                            <div className={styles.thumbnailCont}>
                                <div className={styles.thumbnailBox}>
                                    <img
                                        src={thumbnail}
                                        alt="썸네일"
                                        className={styles.thumbnailPreview}
                                        onClick={handleThumbnailClick} // 태그 추가는 썸네일에서만
                                    />
                                </div>
                                {renderTagMarkers()} {/* 태그 마커 표시 */}
                                <div className={styles.thumbnailControls}>
                                    <Button
                                        size="s"
                                        title={
                                            <i className="bx bx-chevron-up"></i>
                                        }
                                        onClick={() => {
                                            const currentIndex =
                                                images.findIndex(
                                                    img => img.src === thumbnail
                                                )
                                            if (currentIndex > 0) {
                                                moveImage(
                                                    currentIndex,
                                                    currentIndex - 1
                                                )
                                            }
                                        }}
                                    />
                                    <Button
                                        size="s"
                                        title={
                                            isEditingTags
                                                ? '태그 편집 완료'
                                                : images[selectedImageIndex]
                                                      ?.tags.length > 0
                                                ? `상품 태그 ${images[selectedImageIndex]?.tags.length}개`
                                                : '상품태그 추가'
                                        }
                                        onClick={() => {
                                            if (isEditingTags) {
                                                handleFinishEditingTags()
                                            } else {
                                                setIsEditingTags(true)
                                            }
                                        }}
                                    />
                                    <Button
                                        size="s"
                                        title={
                                            <i className="bx bx-chevron-down"></i>
                                        }
                                        onClick={() => {
                                            const currentIndex =
                                                images.findIndex(
                                                    img => img.src === thumbnail
                                                )
                                            if (
                                                currentIndex <
                                                images.length - 1
                                            ) {
                                                moveImage(
                                                    currentIndex,
                                                    currentIndex + 1
                                                )
                                            }
                                        }}
                                    />
                                </div>
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
                                onChange={e =>
                                    setSelectedSpaceType(e.target.value)
                                }
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
                                onChange={e =>
                                    setSelectedAreaSize(e.target.value)
                                }
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

                        <textarea
                            className={styles.txtWriteBox}
                            placeholder="내용을 입력해주세요"
                            value={postContent}
                            onChange={e => setPostContent(e.target.value)} // 글 내용 업데이트
                        ></textarea>

                        {/* 작성 완료 버튼 */}
                        <Button
                            size="s"
                            title="작성 완료"
                            onClick={handleSubmitPost} // 버튼 클릭 시 호출할 함수
                            className={styles.submitButton}
                        />
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    >
                        <div className={styles.tagModal}>
                            <div className={styles.tagSearch}>
                                <Search size="l" />
                            </div>
                            <div className={styles.productList}>
                                {searchResults.map(product => (
                                    <div
                                        key={product.product_seq}
                                        className={styles.searchResultItem}
                                    >
                                        <div className={styles.productImg}>
                                            <img
                                                src={product.product_thumbnail}
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className={styles.productInfo}>
                                            <span>{product.name}</span>
                                            <Button
                                                size="s"
                                                title="선택"
                                                onClick={() =>
                                                    handleAddTag(product)
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </DndProvider>
    )
}
