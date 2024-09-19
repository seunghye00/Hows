import {useEffect, useState} from "react"
import styles from "./Coupon.module.css"
import {api} from "../../../../config/config";

export const Coupon = () => {
    const couponData = [
        {
            coupon_owner_seq: 1,
            member_seq: 1,
            coupon_seq: 1,
            coupon_title: "[ 5% 할인 ] 첫번째 이벤트",
            coupon_type: "percent",
            coupon_discount: "*0.95"
        },
        {
            coupon_owner_seq: 2,
            member_seq: 1,
            coupon_seq: 2,
            coupon_title: "[ 5000원 할인 ] 두번째 이벤트",
            coupon_type: "price",
            coupon_discount: "-5000"
        },
    ]

    useEffect(() => {
        api.get(`/coupon/owner`).then(res => {
            console.log("res === ", res.data);
        });
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.countCoupons}>
                <span>{couponData.length}</span>
                <span>개의 쿠폰</span>
            </div>
            {
                couponData.map((item, i) => {
                    return (
                        <div className={styles.couponBox}>
                            <div className={styles.eventName}>
                                {/* <span className={styles.discount}>[ {item.coupon_discount} 할인 ]</span> */}
                                <span className={styles.title}>{item.coupon_title}</span>
                            </div>
                            <span className={styles.expiredDate}>2024-09-20 23:59:59 까지</span>
                            {/* <span className={styles.expiredDate}>{item.expired_date}</span> */}
                        </div>
                    )
                })
            }
            {/* <div className={styles.couponBox}>
                <div className={styles.eventName}>
                    <span className={styles.discount}>[ 5% 할인 ]</span>
                    <span className={styles.title}>첫번째 이벤트</span>
                </div>
                <span className={styles.expiredDate}>2024-09-20 23:59:59 까지</span>
            </div>
            <div className={styles.couponBox}>
                <div className={styles.eventName}>
                    <span className={styles.discount}>[ 5% 할인 ]</span>
                    <span className={styles.title}>첫번째 이벤트</span>
                </div>
                <span className={styles.expiredDate}>2024-09-20 23:59:59 까지</span>
            </div> */}
        </div>
    )
}