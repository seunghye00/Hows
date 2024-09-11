import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useNavigate } from 'react-router-dom'
import styles from './ProductTagSwiper.module.css'

export const ProductTagSwiper = ({ tagsData }) => {
    const navigate = useNavigate()

    // 상품 상세 페이지 이동
    const goToProductDetail = product_seq => {
        navigate(`/products/${product_seq}`)
    }

    return (
        <div className={styles.productTagContainer}>
            <Swiper
                modules={[Navigation]}
                slidesPerView={6}
                spaceBetween={10}
                navigation={{
                    nextEl: '.swiper-button-next-product',
                    prevEl: '.swiper-button-prev-product',
                }}
                className={styles.productTagSwiper}
            >
                {tagsData.map((tag, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className={styles.productTagBox}
                            onClick={() => goToProductDetail(tag.PRODUCT_SEQ)}
                        >
                            <img
                                src={tag.PRODUCT_THUMBNAIL}
                                alt={tag.PRODUCT_TITLE}
                                className={styles.productImage}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 커스텀 네비게이션 버튼 */}
            <div
                className={`swiper-button-prev-product ${styles.swiperButtonPrev}`}
            >
                <i className="bx bx-left-arrow-alt"></i>
            </div>
            <div
                className={`swiper-button-next-product ${styles.swiperButtonNext}`}
            >
                <i className="bx bx-right-arrow-alt"></i>
            </div>
        </div>
    )
}
