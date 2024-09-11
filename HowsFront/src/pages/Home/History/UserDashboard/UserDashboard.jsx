import styles from "./UserDashboard.module.css";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { BuyList } from "./BuyList/BuyList";
import { Review } from './Review/Review';
import { Delivery } from './Delivery/Delivery';
import { Coupon } from './Coupon/Coupon';
// import { Qna } from './Qna/Qna';
import { TextBox } from './TextBox/TextBox';
import { useEffect, useState } from 'react';

import { api } from "../../../../config/config";

export const UserDashboard = () => {
    const navi = useNavigate();
    const location = useLocation();

    const [buyListData, setBuyListData] = useState([]); // 구매내역 데이터
    const [reviewData, setReviewData] = useState([]); // 리뷰작성내역 데이터
    const [deliveryData, setDeliveryData] = useState([]); // 배송 목록 데이터
    const [couponData, setCouponData] = useState([]); // 쿠폰 데이터

    // 임시 포인트 
    const data = { point: 700 }

    // useEffect(() => {
    //     // 구매내역 데이터 
    //     const fetchBuyListData = api.get(`/`).then((resp) => {
    //         setBuyListData(resp.data);
    //     })
    //     // 리뷰작성내역 데이터 
    //     const fetchReviewData = api.get(`/`).then((resp) => {
    //         setReviewData(resp.data);
    //     })
    //     // 배송 목록 데이터
    //     const fetchDeliveryData = api.get(`/`).then((resp) => {
    //         setDeliveryData(resp.data);
    //     })
    //     // 쿠폰 데이터
    //     const fetchCouponData = api.get(`/coupon`).then((resp) => {
    //         setCouponData(resp.data);
    //     })

    //     // 모든 데이터 가져오기
    //     fetchBuyListData();
    //     fetchCouponData();
    //     fetchDeliveryData();
    //     fetchReviewData();
    // }, [])



    return (
        <div className={styles.container}>
            <div className={styles.pointBox}>
                <span>포인트 : </span>
                <span>{data.point}</span>
            </div>
            <div className={styles.menus}>
                <div className={styles.buyList}>
                    <span
                        onClick={() => navi("buyList")}
                        className={location.pathname.includes("buyList") ? styles.active : ""}
                    >
                        구매내역
                    </span>
                </div>
                <div className={styles.review}>
                    <span
                        onClick={() => navi("review")}
                        className={location.pathname.includes("review") ? styles.active : ""}
                    >
                        리뷰작성내역
                    </span>
                </div>
                <div className={styles.relivery}>
                    <span
                        onClick={() => navi("relivery")}
                        className={location.pathname.includes("relivery") ? styles.active : ""}
                    >
                        주문배송목록
                    </span>
                </div>
                <div className={styles.coupon}>
                    <span
                        onClick={() => navi("coupon")}
                        className={location.pathname.includes("coupon") ? styles.active : ""}
                    >
                        보유쿠폰
                    </span>
                </div>
                {/* <div className={styles.qna}>
                    <span
                        onClick={() => navi("qna")}
                        className={location.pathname.includes("qna") ? styles.active : ""}
                    >
                        문의내역
                    </span>
                </div> */}
            </div>
            <div className={styles.body}>
                {/* <Routes>
                    <Route path="/" element={<Navigate to="buyList" replace />} />
                    <Route path="buyList/*" element={buyListData.length > 0 ? <BuyList data={buyListData} /> : <TextBox text="구매내역" />} />
                    <Route path="review/*" element={reviewData.length > 0 ? <Review data={reviewData} /> : <TextBox text="리뷰작성내역" />} />
                    <Route path="relivery/*" element={deliveryData.length > 0 ? <Delivery data={deliveryData} /> : <TextBox text="주문배송목록" />} />
                    <Route path="coupon/*" element={couponData.length > 0 ? <Coupon data={couponData} /> : <TextBox text="보유쿠폰" />} />
                </Routes> */}
                <Routes>
                    <Route path="/" element={<Navigate to="buyList" replace />} />
                    <Route path="buyList/*" element={<BuyList />} />
                    <Route path="review/*" element={<Review />} />
                    <Route path="relivery/*" element={<Delivery />} />
                    <Route path="coupon/*" element={<Coupon />} />
                    {/* <Route path="qna/*" element={<Qna />} /> */}
                </Routes>
            </div>
        </div>
    )
}