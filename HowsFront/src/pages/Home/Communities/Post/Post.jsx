import React, { useState, useRef, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useNavigate } from 'react-router-dom' // 리다이렉트를 위한 Hook 추가
import styles from './Post.module.css'
import { Button } from '../../../../components/Button/Button'
import { Search } from '../../../../components/Search/Search'
import Swal from 'sweetalert2'
import { useDropzone } from 'react-dropzone'
import { Modal } from '../../../../components/Modal/Modal'
import {
    submitPost,
    getHousingTypes,
    getSpaceTypes,
    getAreaSizes,
    purchaseHistory,
} from '../../../../api/community' // 수정된 import 부분

const ItemType = 'IMAGE'

export const Post = () => {
    const [images, setImages] = useState([]) // 여러 이미지를 저장할 배열
    const [thumbnail, setThumbnail] = useState(null) // 썸네일로 지정된 이미지
    const [isModalOpen, setIsModalOpen] = useState(false) // 상품 태그 모달
    const [isEditingTags, setIsEditingTags] = useState(false) // 태그 편집 상태
    const [selectedImageIndex, setSelectedImageIndex] = useState(0) // 태그 모달을 연 이미지의 인덱스
    const [tagPosition, setTagPosition] = useState({}) // 태그 위치 저장
    const [dominantColor, setDominantColor] = useState('C0') // 추출된 색상을 저장할 상태
    const [searchResults, setSearchResults] = useState([]) // 구매 상품 태그 데이터

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

    const navigate = useNavigate() // 리다이렉트를 위한 useNavigate Hook 추가

    // 이미지에서 색상을 추출하는 함수
    const extractColorFromImage = (imageSrc, callback) => {
        const img = document.createElement('img')
        img.crossOrigin = 'Anonymous'
        img.src = imageSrc

        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, img.width, img.height)

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            ).data
            const colorCount = {}

            // 중앙 좌표 계산
            const centerX = Math.floor(img.width / 2)
            const centerY = Math.floor(img.height / 2)

            // 주변 픽셀 색상 추출
            const offsets = [
                { x: 0, y: 0 }, // 중앙
                { x: -1, y: 0 }, // 왼쪽
                { x: 1, y: 0 }, // 오른쪽
                { x: 0, y: -1 }, // 위
                { x: 0, y: 1 }, // 아래
                { x: -1, y: -1 }, // 왼쪽 위
                { x: -1, y: 1 }, // 왼쪽 아래
                { x: 1, y: -1 }, // 오른쪽 위
                { x: 1, y: 1 }, // 오른쪽 아래
            ]

            offsets.forEach(({ x, y }) => {
                const pixelX = centerX + x
                const pixelY = centerY + y

                // 이미지 범위 내에서만 색상 추출
                if (
                    pixelX >= 0 &&
                    pixelX < img.width &&
                    pixelY >= 0 &&
                    pixelY < img.height
                ) {
                    const index = (pixelY * img.width + pixelX) * 4
                    const r = imageData[index]
                    const g = imageData[index + 1]
                    const b = imageData[index + 2]

                    // 특정 임계값 이하의 색상 제외
                    if (r < 20 && g < 20 && b < 20) return // 너무 어두운 색상 제외

                    // 비슷한 색상 그룹화
                    const key = `${Math.floor(r / 32) * 32},${
                        Math.floor(g / 32) * 32
                    },${Math.floor(b / 32) * 32}`
                    colorCount[key] = (colorCount[key] || 0) + 1
                }
            })

            let dominantColor = ''
            let maxCount = 0

            for (const color in colorCount) {
                if (colorCount[color] > maxCount) {
                    maxCount = colorCount[color]
                    dominantColor = color
                }
            }

            const rgb = dominantColor.split(',').map(Number)
            console.log(`Extracted Dominant RGB: ${rgb[0]},${rgb[1]},${rgb[2]}`)

            callback(rgb)
        }

        img.onerror = err => {
            console.error('이미지를 불러오는 중 오류가 발생했습니다:', err)
            callback([0, 0, 0]) // 오류 발생 시 기본 검정색 처리
        }
    }

    // 썸네일 이미지가 바뀔 때마다 색상을 추출하는 로직
    useEffect(() => {
        if (thumbnail) {
            extractColorFromImage(thumbnail, rgb => {
                const colorCode = mapColorToCode(rgb)
                console.log(`Mapped Color Code: ${colorCode}`) // 매핑된 색상 코드 콘솔에 출력
                setDominantColor(colorCode)
            })
        }
    }, [thumbnail])

    // 좌표를 퍼센트로 변환하는 함수
    const convertToPercent = (x, y, imgWidth, imgHeight) => {
        const leftPercent = (x / imgWidth) * 100
        const topPercent = (y / imgHeight) * 100
        return { left: leftPercent, top: topPercent }
    }

    // RGB 값을 color_code로 매핑하는 함수
    const mapColorToCode = rgb => {
        if (!rgb) return 'C0' // 색상을 추출하지 못했을 때 'C0'으로 처리

        const [r, g, b] = rgb

        if (r > 180 && g > 180 && b > 180) return 'C1' // 화이트
        if (r < 70 && g < 70 && b < 70) return 'C2' // 블랙
        if (r > 120 && r < 200 && g > 120 && g < 200 && b > 120 && b < 200)
            return 'C3' // 그레이
        if (r > 160 && g > 160 && b < 120) return 'C4' // 옐로우
        if (r < 130 && g < 130 && b > 140) return 'C5' // 블루 (범위 확대)
        if (r > 180 && g < 160 && b < 160) return 'C6' // 핑크
        if (r > 180 && g < 120 && b < 120) return 'C7' // 레드
        if (r > 150 && g < 120 && b < 80) return 'C8' // 브라운
        if (g > 130 && r < 140 && b < 120) return 'C9' // 그린

        return 'C0' // 해당되는 색상 코드가 없을 경우 기본적으로 'C0' 처리
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            if (images.length + acceptedFiles.length > 5) {
                Swal.fire({
                    icon: 'warning',
                    title: '업로드 제한',
                    text: '이미지는 최대 5장까지만 업로드할 수 있습니다.',
                })
                return
            }

            const validFiles = acceptedFiles.filter(file => {
                const fileExtension = file.name.split('.').pop().toLowerCase()
                const isValidExtension = ['jpg', 'jpeg', 'png', 'gif'].includes(
                    fileExtension
                )
                const isValidSize = file.size <= MAX_IMAGE_SIZE_BYTES

                if (!isValidExtension || !isValidSize) {
                    Swal.fire({
                        icon: 'error',
                        title: '파일 오류',
                        text: '유효하지 않은 파일이거나 파일 용량이 큽니다.',
                    })
                    return false
                }
                return true
            })

            validFiles.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImages(prevImages => [
                        ...prevImages,
                        { src: reader.result, file: file, tags: [] },
                    ])
                    if (!thumbnail) setThumbnail(reader.result) // 첫 번째 이미지를 썸네일로 설정
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

    const handleSetThumbnail = (imageSrc, index) => {
        setThumbnail(imageSrc)
        setSelectedImageIndex(index)
    }

    const handleRemoveImage = index => {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)

        if (thumbnail === images[index]?.src) {
            setThumbnail(updatedImages[0]?.src || null)
            setSelectedImageIndex(0)
        }
    }

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
        setIsModalOpen(false)
    }

    const handleThumbnailClick = e => {
        if (isEditingTags && selectedImageIndex !== null) {
            const rect = e.target.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const imgWidth = rect.width
            const imgHeight = rect.height

            const { left, top } = convertToPercent(x, y, imgWidth, imgHeight)

            setTagPosition({ left, top })
            setIsModalOpen(true)
        }
    }

    const handleFinishEditingTags = () => {
        setIsEditingTags(false)
    }

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
                onClick={() => handleDeleteTag(i, tag.product.name)}
            >
                <i className="bx bx-plus"></i>
            </div>
        ))
    }

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
                        onClick={() => handleSetThumbnail(image.src, index)}
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const housingTypes = await getHousingTypes()
                setHousingTypes(housingTypes)

                const spaceTypes = await getSpaceTypes()
                setSpaceTypes(spaceTypes)

                const areaSizes = await getAreaSizes()
                setAreaSizes(areaSizes)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    // 게시글 작성 완료 처리 핸들러
    const handleSubmitPost = async () => {
        const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기

        // 글 내용과 이미지, 주거 형태, 공간, 평수 선택 여부 확인
        if (
            !postContent ||
            images.length === 0 ||
            !selectedHousingType ||
            !selectedSpaceType ||
            !selectedAreaSize
        ) {
            Swal.fire({
                icon: 'warning',
                title: '작성 실패',
                text: '글 내용, 이미지, 주거 형태, 공간, 평수를 모두 선택해주세요.',
            })
            return
        }

        if (isEditingTags) {
            Swal.fire({
                icon: 'warning',
                title: '작성 실패',
                text: '태그 편집을 완료한 후 다시 시도해주세요.',
            })
            return
        }

        try {
            const formData = new FormData()

            // 게시글 정보 추가
            formData.append('housing_type_code', selectedHousingType)
            formData.append('space_type_code', selectedSpaceType)
            formData.append('area_size_code', selectedAreaSize)
            formData.append('board_contents', postContent)
            formData.append('member_id', member_id)
            console.log(dominantColor, '색상 코드 확인')
            formData.append('color_code', dominantColor) // color_code 추가
            // 이미지 및 태그 정보 추가
            if (images.length === 1) {
                // 이미지가 하나일 때
                const image = images[0]
                formData.append('files', image.file)

                // 태그가 없을 경우에도 빈 배열로 전송
                const tags =
                    image.tags.length > 0
                        ? image.tags.map(tag => ({
                              product_seq: tag.product.product_seq,
                              left_position: tag.position.left,
                              top_position: tag.position.top,
                          }))
                        : []
                console.log('이미지 하나일 때 확인')
                formData.append('tag', JSON.stringify(tags))
                images.forEach((_, index) =>
                    formData.append('image_orders', index + 1)
                )
            } else {
                // 이미지가 여러 개일 때
                images.forEach((image, index) => {
                    formData.append('files', image.file)
                    // 태그가 없을 경우에도 빈 배열로 전송
                    const tags =
                        image.tags.length > 0
                            ? image.tags.map(tag => ({
                                  product_seq: tag.product.product_seq,
                                  left_position: tag.position.left,
                                  top_position: tag.position.top,
                              }))
                            : []
                    formData.append('tags', JSON.stringify(tags))
                })
                // 이미지 순서 배열 추가 (배열 자체로 추가)
                images.forEach((_, index) =>
                    formData.append('image_orders', index + 1)
                )
            }

            // 분리된 api 모듈 사용
            console.log('전송되는 formData:', [...formData.entries()])
            const response = await submitPost(formData)

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '게시글 작성 완료',
                    text: '게시글과 이미지가 성공적으로 작성되었습니다.',
                })
                navigate('/communities')
            } else {
                throw new Error('이미지 및 태그 저장 실패')
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

    // 구매내역 불러오기
    useEffect(() => {
        if (isModalOpen) {
            const fetchPurchaseHistory = async () => {
                try {
                    const data = await purchaseHistory()

                    // 서버에서 대문자로 반환되는 필드를 소문자로 변환해서 저장
                    const formattedData = data.map(item => ({
                        product_seq: item.PRODUCT_SEQ,
                        product_thumbnail: item.PRODUCT_THUMBNAIL,
                        name: item.PRODUCT_TITLE,
                    }))

                    setSearchResults(formattedData)
                } catch (error) {
                    console.error('Error fetching purchase history:', error)
                }
            }

            fetchPurchaseHistory()
        }
    }, [isModalOpen]) // isModalOpen이 변경될 때마다 실행

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
                                        onClick={handleThumbnailClick}
                                    />
                                </div>
                                {renderTagMarkers()}
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
                            onChange={e => setPostContent(e.target.value)}
                        ></textarea>

                        <Button
                            size="s"
                            title="작성 완료"
                            onClick={handleSubmitPost}
                            className={styles.submitButton}
                        />
                    </div>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    >
                        <div className={styles.tagModal}>
                            <div className={styles.tagTitle}>
                                <h2>구매 내역</h2>
                            </div>
                            <div className={styles.productList}>
                                {searchResults.length > 0 ? (
                                    searchResults.map(product => (
                                        <div
                                            key={product.product_seq}
                                            className={styles.searchResultItem}
                                        >
                                            <div className={styles.productImg}>
                                                <img
                                                    src={
                                                        product.product_thumbnail
                                                    }
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
                                    ))
                                ) : (
                                    <div className={styles.noProductsMessage}>
                                        <p>구매한 상품이 없습니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </DndProvider>
    )
}
