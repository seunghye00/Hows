import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import styles from './ImageSwiper.module.css'
import { Modal } from '../../../../../../components/Modal/Modal'

export const ImageSwiper = ({ images, tags }) => {
    const [selectedTag, setSelectedTag] = useState(null) // 선택된 태그 상태
    const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태
    const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수
    if (!images || images.length === 0) {
        return <div>이미지가 없습니다.</div>
    }
    // 태그 클릭 시 모달 열림
    const handleTagClick = tag => {
        setSelectedTag(tag) // 클릭된 태그를 설정
        setIsModalOpen(true) // 모달 열기
    }
    return (
        <div className={styles.imageSwiperContainer}>
            <Swiper
                modules={[Pagination, Navigation]}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next-image',
                    prevEl: '.swiper-button-prev-image',
                }}
                className={styles.imageSwiper}
            >
                {images.map((image, i) => (
                    <SwiperSlide key={i}>
                        <div className={styles.ImageBox}>
                            {/* 이미지 */}
                            <img
                                src={image.IMAGE_URL}
                                alt={`Slide ${i}`}
                                className={styles.slideImage}
                            />

                            {/* 이미지에 맞는 태그 필터링 */}
                            {/* tags가 null 또는 undefined가 아닌지 확인 */}
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
                                            onClick={() => handleTagClick(tag)} // 태그 클릭 시 실행
                                        >
                                            {/* 상품 이미지와 정보 */}
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedTag && (
                    <div className={styles.modalContent}>
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
                            <p className={styles.product_title}>
                                {selectedTag.PRODUCT_CONTENTS}
                            </p>
                            <strong>{selectedTag.PRICE}원</strong>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
