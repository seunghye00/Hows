import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useNavigate } from 'react-router-dom'
import img from './../../../../../../assets/images/꼬래.png'
import styles from './ProductTagSwiper.module.css'

export const ProductTagSwiper = () => {
    const navigate = useNavigate()

    const products = [
        { product_seq: 1, name: 'Product1', imgSrc: img },
        { product_seq: 2, name: 'Product2', imgSrc: img },
        { product_seq: 3, name: 'Product3', imgSrc: img },
        { product_seq: 4, name: 'Product4', imgSrc: img },
        { product_seq: 5, name: 'Product5', imgSrc: img },
        { product_seq: 6, name: 'Product6', imgSrc: img },
        { product_seq: 7, name: 'Product7', imgSrc: img },
    ]

    const goToProductDetail = product_seq => {
        navigate(`/product/${product_seq}`)
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
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className={styles.productTagBox}
                            onClick={() =>
                                goToProductDetail(product.product_seq)
                            }
                        >
                            <img
                                src={product.imgSrc}
                                alt={product.name}
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
