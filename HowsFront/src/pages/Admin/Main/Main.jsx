import React, { useEffect, useState } from 'react'
import { BarChart } from '../../../components/Chart/Bar'
import { DoughnutChart } from '../../../components/Chart/Doughnut'
import { LineChart } from '../../../components/Chart/Line'
import styles from './Main.module.css'
import { todayBoardNum } from '../../../api/community'
// Swiper import
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css' // Swiper 기본 스타일
import 'swiper/css/autoplay' // Autoplay 모듈 스타일
import 'swiper/css/pagination' // Pagination 모듈 스타일
import 'swiper/css/navigation' // Navigation 모듈 스타일

// Swiper 모듈 사용
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { todayPaymentPrice } from '../../../api/payment'

export const Main = () => {
    const [boardNum, setBoardNum] = useState(0)
    const [paymentPrice, setPaymentPrice] = useState(0)

    useEffect(() => {
        todayBoardNum()
            .then(resp => {
                // console.log('resp.data === ', resp.data)
                setBoardNum(resp.data)
            })
            .catch(error => {
                console.log(error)
            })

        todayPaymentPrice()
            .then(resp => {
                // console.log('resp.data === ', resp.data)
                setPaymentPrice(resp.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.leftBox}>
                    <h1>How's DashBoard</h1>
                    <div className={styles.subBox}>
                        <div className={styles.contBox}>
                            <span className={styles.subTitle}>
                                오늘 작성된 게시글 수
                            </span>
                            <span className={styles.result}>{boardNum}</span>
                        </div>
                        <div className={styles.contBox}>
                            <span className={styles.subTitle}>오늘 매출</span>
                            <span className={styles.result}>
                                {paymentPrice}
                            </span>
                        </div>
                    </div>
                    <div className={styles.listBox}>리스트</div>
                </div>
                <div className={styles.rightBox}>
                    <DoughnutChart />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.graphBox}>
                    <BarChart />
                </div>
                <div className={styles.graphBox}>
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]} // 모듈을 여기서 등록
                        spaceBetween={50}
                        slidesPerView={1}
                        loop={true} // 무한 루프
                        pagination={{ clickable: true }} // 페이지네이션 사용
                        navigation={true} // 네비게이션 사용
                        className={styles.swiper} // 스타일 클래스
                    >
                        <SwiperSlide>
                            <LineChart category="areaType" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <LineChart category="housingType" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <LineChart category="spaceType" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <LineChart category="color" />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    )
}
