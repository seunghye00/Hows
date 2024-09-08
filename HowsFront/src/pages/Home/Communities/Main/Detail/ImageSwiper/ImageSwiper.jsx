import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import img from './../../../../../../assets/images/꼬래.png'
import styles from './ImageSwiper.module.css'

export const ImageSwiper = () => {
    const images = [img, img, img] // 이미지 배열
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
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt={`Slide ${index}`}
                            className={styles.slideImage}
                        />
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
        </div>
    )
}
