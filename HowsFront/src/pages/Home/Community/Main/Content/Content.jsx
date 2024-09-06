import React, { useState, useEffect } from 'react'
import styles from './Content.module.css'
import img from '../../../../../assets/images/cry.jpg'
import { Button } from '../../../../../components/Button/Button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export const Content = () => {
    return (
        <div className={styles.contentWrap}>
            <div className={styles.contentCont}>
                <div className={styles.contentTop}>
                    <div className={styles.profile}>
                        <div className={styles.profileImg}>
                            <img src={img} alt="" />
                        </div>
                        <div className={styles.profileNickname}>
                            Moontari_96
                        </div>
                    </div>
                    <div className={styles.followBtn}>
                        <Button title="팔로우" size="s" />
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.mainContent}>
                        <div className={styles.mainContentImg}>
                            <Swiper
                                pagination={(true, { clickable: true })}
                                modules={[Pagination]}
                                className={styles.swiperBox}
                            >
                                <SwiperSlide>
                                    <img src={img} alt="" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={img} alt="" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={img} alt="" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={img} alt="" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={img} alt="" />
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <div className={styles.mainContentTxt}>
                            <div className={styles.btnBox}>
                                <div className={styles.btnLeft}>
                                    <div className={styles.likeBtn}>
                                        <a>
                                            <i className="bx bx-heart"></i>
                                        </a>
                                        <span className={styles.likeCount}>
                                            185
                                        </span>
                                    </div>
                                    <div className={styles.comment}>
                                        <i className="bx bx-comment"></i>
                                        <span className={styles.commentCount}>
                                            12
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.btnRight}>
                                    <a className={styles.bookMark}>
                                        <i className="bx bx-bookmark"></i>
                                    </a>
                                </div>
                            </div>
                            <div className={styles.contentBox}>
                                #가구는 역시 #How's #내돈내산 #셀프인테리어
                                #1인가구
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
