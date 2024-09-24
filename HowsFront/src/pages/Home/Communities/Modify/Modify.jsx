import React, { useState, useRef, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useNavigate, useParams } from 'react-router-dom' // useParams 추가
import styles from './Modify.module.css'
import { Button } from '../../../../components/Button/Button'
import { Search } from '../../../../components/Search/Search'
import Swal from 'sweetalert2'
import { useDropzone } from 'react-dropzone'
import { Modal } from '../../../../components/Modal/Modal'
import {
    getHousingTypes,
    getSpaceTypes,
    getAreaSizes,
    getPostData,
    getImageData,
    getTagData,
    updatePostData,
    purchaseHistory,
} from '../../../../api/community' // 필요한 API 추가

const ItemType = 'IMAGE'

export const Modify = () => {
    const { board_seq } = useParams() // 게시글 ID 받아오기
    const [images, setImages] = useState([]) // 여러 이미지를 저장할 배열
    const [thumbnail, setThumbnail] = useState(null) // 썸네일로 지정된 이미지
    const [isModalOpen, setIsModalOpen] = useState(false) // 상품 태그 모달
    const [isEditingTags, setIsEditingTags] = useState(false) // 태그 편집 상태
    const [selectedImageIndex, setSelectedImageIndex] = useState(0) // 태그 모달을 연 이미지의 인덱스
    const [tagPosition, setTagPosition] = useState({}) // 태그 위치 저장
    const [tagsData, setTagsData] = useState([]) // 태그 데이터
    const [postContent, setPostContent] = useState('') // 글 내용
    const [housingTypes, setHousingTypes] = useState([])
    const [spaceTypes, setSpaceTypes] = useState([])
    const [areaSizes, setAreaSizes] = useState([])
    const navigate = useNavigate() // 리다이렉트를 위한 useNavigate Hook 추가
    const [selectedHousingType, setSelectedHousingType] = useState('')
    const [selectedSpaceType, setSelectedSpaceType] = useState('')
    const [selectedAreaSize, setSelectedAreaSize] = useState('')
    const [dominantColor, setDominantColor] = useState('C0') // 추출된 색상을 저장할 상태
    const [searchResults, setSearchResults] = useState([]) // 구매 상품 태그 데이터

    // 좌표를 퍼센트로 변환하는 함수
    const convertToPercent = (x, y, imgWidth, imgHeight) => {
        const leftPercent = (x / imgWidth) * 100
        const topPercent = (y / imgHeight) * 100
        return { left: leftPercent, top: topPercent }
    }
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
                const isValidSize = file.size <= 1024 * 1024 * 2

                if (!isValidExtension || !isValidSize) {
                    Swal.fire({
                        icon: 'error',
                        title: '파일 오류',
                        text: `${file.name}은 유효하지 않은 파일 형식이거나 용량을 초과했습니다.`,
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
                        { src: reader.result, file, tags: [] }, // 새로운 이미지에 태그를 빈 배열로 초기화
                    ])
                    if (images.length === 0) setThumbnail(reader.result)
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

            if (thumbnail === prevImages[dragIndex]?.src) {
                setThumbnail(updatedImages[hoverIndex]?.src)
                setSelectedImageIndex(hoverIndex)
            }
            // 이미지 순서 콘솔 출력
            console.log(
                'Updated Image Order:',
                updatedImages.map((img, idx) => ({
                    index: idx + 1,
                    src: img.src,
                }))
            )

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

    // 태그정보 위치 저장 클릭 시 태그 정보 swal
    const renderTagMarkers = () => {
        const existingTags = tagsData && Array.isArray(tagsData) ? tagsData : []
        const newTags = images[selectedImageIndex]?.tags || []

        // 기존 태그 렌더링
        const existingTagMarkers = existingTags.map((tag, i) => (
            <div
                key={`existing-${i}`}
                className={styles.tagMarker}
                style={{
                    position: 'absolute',
                    left: `${tag.LEFT_POSITION}%`,
                    top: `${tag.TOP_POSITION}%`,
                    margin: '-9px 0 0 -9px',
                }}
                onClick={() =>
                    handleDeleteTag(
                        'existing',
                        i,
                        tag.PRODUCT_TITLE || '알 수 없는 상품'
                    )
                } // 기존 태그일 경우 'existing'을 전달
            >
                <i className="bx bx-plus"></i>
            </div>
        ))

        // 새로 추가한 태그 렌더링
        const newTagMarkers = newTags.map((tag, i) => (
            <div
                key={`new-${i}`}
                className={styles.tagMarker}
                style={{
                    position: 'absolute',
                    left: `${tag.position?.left || tag.LEFT_POSITION}%`,
                    top: `${tag.position?.top || tag.TOP_POSITION}%`,
                    margin: '-9px 0 0 -9px',
                }}
                onClick={() =>
                    handleDeleteTag('new', i, tag.name || '알 수 없는 상품')
                } // 새로 추가된 태그일 경우 'new'를 전달
            >
                <i className="bx bx-plus"></i>
            </div>
        ))

        return [...existingTagMarkers, ...newTagMarkers]
    }

    // 태그 삭제 처리
    const handleDeleteTag = (type, tagIndex, productName) => {
        Swal.fire({
            title: `태그 삭제: ${productName}`,
            text: '태그를 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                if (type === 'existing') {
                    // 기존 태그 삭제 처리
                    const updatedTags = [...tagsData]
                    updatedTags.splice(tagIndex, 1) // 해당 태그 삭제
                    setTagsData(updatedTags)
                } else if (type === 'new') {
                    // 새로 추가한 태그 삭제 처리
                    const updatedImages = [...images]
                    const selectedImage = updatedImages[selectedImageIndex]
                    selectedImage.tags.splice(tagIndex, 1) // 해당 태그 삭제
                    setImages(updatedImages)
                }

                Swal.fire('태그가 삭제되었습니다.', '', 'success')
            }
        })
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

    // 서버에서 데이터 받아오기 위한 useEffect 추가
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const housingTypesData = await getHousingTypes()
                setHousingTypes(housingTypesData)

                const spaceTypesData = await getSpaceTypes()
                setSpaceTypes(spaceTypesData)

                const areaSizesData = await getAreaSizes()
                setAreaSizes(areaSizesData)

                const postData = await getPostData(board_seq)
                setPostContent(postData.data.BOARD_CONTENTS)
                setSelectedHousingType(postData.data.HOUSING_TYPE_CODE)
                setSelectedSpaceType(postData.data.SPACE_TYPE_CODE)
                setSelectedAreaSize(postData.data.AREA_SIZE_CODE)

                const imageData = await getImageData(board_seq)
                const tagData = await getTagData(board_seq)

                // 이미지 데이터 매핑
                const imageList = imageData.data.images.map(image => ({
                    src: image.IMAGE_URL,
                    BOARD_IMAGE_SEQ: image.BOARD_IMAGE_SEQ, // 이미지 ID
                    tags: [], // 태그는 아래에서 매핑될 예정
                }))

                // 태그 데이터를 이미지에 매핑
                const updatedImages = imageList.map(image => {
                    const imageTags = tagData.data.tags
                        .filter(
                            tag => tag.BOARD_IMAGE_SEQ === image.BOARD_IMAGE_SEQ
                        )
                        .map(tag => ({
                            product_seq: tag.PRODUCT_SEQ,
                            name: tag.PRODUCT_TITLE, // 태그 이름
                            position: {
                                left: tag.LEFT_POSITION,
                                top: tag.TOP_POSITION,
                            },
                        }))

                    // 태그가 매핑된 이미지를 반환
                    return { ...image, tags: imageTags }
                })

                setImages(updatedImages)
                setThumbnail(updatedImages[0]?.src || null)
            } catch (error) {
                console.error('초기 데이터 불러오는 중 오류:', error)
            }
        }

        fetchInitialData()
    }, [board_seq])

    // 게시글 수정 완료 처리 핸들러
    const handleSubmitPost = async () => {
        const member_id = sessionStorage.getItem('member_id') // 세션에서 member_id 가져오기

        if (!postContent || images.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '작성 실패',
                text: '글 내용과 이미지를 모두 입력해주세요.',
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
            formData.append('housing_type_code', selectedHousingType)
            formData.append('space_type_code', selectedSpaceType)
            formData.append('area_size_code', selectedAreaSize)
            formData.append('board_contents', postContent)
            formData.append('member_id', member_id)
            formData.append('color_code', dominantColor) // color_code 추가
            // 기존 이미지 URL 목록 추가
            const existingImageUrls = images
                .filter(image => !image.file) // 새로운 파일이 없는 기존 이미지 필터링
                .map(image => image.src) // URL로 변환
            formData.append(
                'existing_image_urls',
                JSON.stringify(existingImageUrls)
            )

            const newImageFiles = images.filter(image => image.file) // 새로 업로드된 이미지 파일
            const newImageOrders = []
            const existingImageOrders = []

            // 태그 데이터 배열 초기화
            const allTags = []

            // 이미지 및 태그 정보 추가
            images.forEach((image, index) => {
                if (image.file) {
                    formData.append('new_files', image.file) // 새로운 파일 추가
                    newImageOrders.push(index + 1) // 새 이미지 순서 배열에 추가
                } else {
                    existingImageOrders.push(index + 1) // 기존 이미지 순서 배열에 추가
                }

                // 이미지의 태그 추가
                const tags = image.tags.map(tag => ({
                    product_seq: tag.product_seq,
                    left_position: tag.position.left,
                    top_position: tag.position.top,
                }))

                // 해당 이미지와 함께 태그 정보를 추가
                formData.append(`tags_json_${index}`, JSON.stringify(tags)) // 태그 추가
            })

            // 이미지 순서 정보 추가 (배열을 직접 추가)
            newImageOrders.forEach(order =>
                formData.append('new_image_orders', order)
            )
            existingImageOrders.forEach(order =>
                formData.append('existing_image_orders', order)
            )
            // 콘솔에 이미지 순서 출력
            console.log('New Image Orders:', newImageOrders)
            console.log('Existing Image Orders:', existingImageOrders)
            console.log('전송되는 formData:', [...formData.entries()]) // 전송되는 데이터 확인
            const response = await updatePostData(board_seq, formData) // 서버로 전송

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: '게시글 수정 완료',
                    text: '게시글이 성공적으로 수정되었습니다.',
                })
                navigate(`/communities/${board_seq}`)
            } else {
                throw new Error('이미지 및 태그 저장 실패')
            }
        } catch (error) {
            console.error('게시글 수정 오류:', error)
            Swal.fire({
                icon: 'error',
                title: '작성 실패',
                text: '서버와의 통신 중 오류가 발생했습니다.',
            })
        }
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

    const handleAddTag = product => {
        // 이미지 배열이 존재하고 선택된 이미지 인덱스가 유효한지 확인
        if (!images[selectedImageIndex]) {
            console.error('선택된 이미지가 없습니다.')
            return
        }

        // 선택된 이미지의 태그 배열이 undefined일 경우 초기화
        const updatedImages = [...images]
        const selectedImage = updatedImages[selectedImageIndex]
        selectedImage.tags = selectedImage.tags || []

        // 새로운 태그 추가
        selectedImage.tags.push({
            product_seq: product.product_seq, // 임시 데이터의 product_seq 사용
            name: product.name, // 임시 데이터의 name 사용
            thumbnail: product.product_thumbnail, // 임시 데이터의 product_thumbnail 사용
            position: tagPosition, // 태그의 위치
        })

        // 상태 업데이트
        setImages(updatedImages)

        Swal.fire({
            icon: 'success',
            title: '상품 태그 추가 완료',
            text: `${product.name}이(가) 태그로 추가되었습니다.`,
        })

        setIsModalOpen(false)
    }
    // 상품 태그 개수 표시 수정
    const renderTagCount = () => {
        const existingTagsCount = tagsData.length
        const newTagsCount = images[selectedImageIndex]?.tags?.length || 0
        const totalTagCount = existingTagsCount + newTagsCount // 총 태그 개수 계산

        return totalTagCount === 0
            ? '상품 태그'
            : `상품 태그 ${totalTagCount}개`
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
                <div className={styles.writeTit}>게시글 수정</div>
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
                                    <p>최대 5장까지 업로드 가능합니다.</p>
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
                                {images.length < 5 && (
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
                                                : renderTagCount()
                                        }
                                        onClick={() =>
                                            setIsEditingTags(!isEditingTags)
                                        }
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
                            title="수정 완료"
                            onClick={handleSubmitPost}
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
