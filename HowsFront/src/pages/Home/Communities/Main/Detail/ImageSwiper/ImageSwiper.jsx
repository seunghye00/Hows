import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import styles from './ImageSwiper.module.css'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../../../../../../components/Modal/Modal'
import { ProductTagSwiper } from '../ProductTagSwiper/ProductTagSwiper'

export const ImageSwiper = ({ images, tags }) => {
    const [selectedTag, setSelectedTag] = useState(null) // 선택된 태그 상태
    const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태
    const [currentTags, setCurrentTags] = useState([]) // 현재 이미지에 맞는 태그들
    const [sortedImages, setSortedImages] = useState([]) // image_order로 정렬된 이미지 상태
    const navigate = useNavigate()
    console.log(images)
    // 태그 클릭 시 모달 열림
    const handleTagClick = tag => {
        setSelectedTag(tag) // 클릭된 태그를 설정
        setIsModalOpen(true) // 모달 열기
    }

    // 모달에서 상품 클릭 시 해당 페이지로 이동
    const handleProductClick = productSeq => {
        navigate(`/products/${productSeq}`) // 상품 상세 페이지로 이동
        setIsModalOpen(false) // 모달 닫기
    }

    // 각 이미지에 맞는 태그 필터링
    const handleImageChange = imageSeq => {
        if (tags && tags.length > 0) {
            const filteredTags = tags.filter(
                tag => tag.BOARD_IMAGE_SEQ === imageSeq
            )
            setCurrentTags(filteredTags) // 현재 이미지에 맞는 태그 업데이트
        } else {
            setCurrentTags([]) // 태그가 없으면 빈 배열 설정
        }
    }

    // 이미지 데이터가 들어왔을 때 image_order로 정렬
    useEffect(() => {
        if (images && images.length > 0) {
            const sorted = [...images].sort(
                (a, b) => a.IMAGE_ORDER - b.IMAGE_ORDER
            )
            setSortedImages(sorted)
            handleImageChange(sorted[0]?.BOARD_IMAGE_SEQ) // 첫 번째 이미지의 태그 설정
        }
    }, [images, tags])

    return (
        <div className={styles.imageSwiperContainer}>
            <Swiper
                modules={[Pagination, Navigation]}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next-image',
                    prevEl: '.swiper-button-prev-image',
                }}
                onSlideChange={swiper =>
                    handleImageChange(
                        sortedImages[swiper.activeIndex]?.BOARD_IMAGE_SEQ
                    )
                }
                className={styles.imageSwiper}
            >
                {sortedImages &&
                    sortedImages.map((image, i) => (
                        <SwiperSlide key={i}>
                            <div className={styles.ImageBox}>
                                <img
                                    src={image.IMAGE_URL}
                                    alt={`Slide ${i}`}
                                    className={styles.slideImage}
                                />

                                {tags &&
                                    tags
                                        .filter(
                                            tag =>
                                                tag.BOARD_IMAGE_SEQ ===
                                                image.BOARD_IMAGE_SEQ
                                        )
                                        .map((tag, index) => (
                                            <div
                                                key={index}
                                                className={styles.productTag}
                                                style={{
                                                    left: `${tag.LEFT_POSITION}%`,
                                                    top: `${tag.TOP_POSITION}%`,
                                                    position: 'absolute',
                                                }}
                                                onClick={() =>
                                                    handleTagClick(tag)
                                                }
                                            >
                                                <i className="bx bx-plus"></i>
                                            </div>
                                        ))}
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>

            {/* 커스텀 네비게이션 버튼 */}
            <div
                className={`swiper-button-prev-image ${styles.swiperButtonPrev}`}
            >
                <i className="bx bx-left-arrow-alt"></i>
            </div>
            <div
                className={`swiper-button-next-image ${styles.swiperButtonNext}`}
            >
                <i className="bx bx-right-arrow-alt"></i>
            </div>

            {/* 현재 이미지에 해당하는 상품 태그 스와이퍼 */}
            <ProductTagSwiper tagsData={currentTags} />

            {/* 모달 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedTag && (
                    <div
                        className={styles.modalContent}
                        onClick={() =>
                            handleProductClick(selectedTag.PRODUCT_SEQ)
                        }
                    >
                        <div className={styles.productImgBox}>
                            <img
                                src={selectedTag.PRODUCT_THUMBNAIL}
                                alt={selectedTag.PRODUCT_TITLE}
                                className={styles.productThumbnail}
                            />
                        </div>
                        <div className={styles.productInfo}>
                            <p className={styles.product_title}>
                                {selectedTag.PRODUCT_TITLE}
                            </p>
                            <p className={styles.product_price}>
                                {selectedTag.PRICE}원
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
