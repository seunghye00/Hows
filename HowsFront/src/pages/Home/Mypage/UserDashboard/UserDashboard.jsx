import styles from "./UserDashboard.module.css";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { BuyList } from "./BuyList/BuyList";
import { Review } from './Review/Review';
import { Delivery } from './Delivery/Delivery';
import { Coupon } from './Coupon/Coupon';
import { Qna } from './Qna/Qna';

export const UserDashboard = () => {
    const navi = useNavigate();
    const location = useLocation();

    return (
        <div className={styles.container}>
            <div className={styles.pointBox}>
                <span>포인트 : </span>
                <span>700</span>
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
                <div className={styles.qna}>
                    <span
                        onClick={() => navi("qna")}
                        className={location.pathname.includes("qna") ? styles.active : ""}
                    >
                        문의내역
                    </span>
                </div>
            </div>
            <div className={styles.body}>
                <Routes>
                    <Route path="/" element={<Navigate to="buyList" replace />} />
                    <Route path="buyList/*" element={<BuyList />} />
                    <Route path="review/*" element={<Review />} />
                    <Route path="relivery/*" element={<Delivery />} />
                    <Route path="coupon/*" element={<Coupon />} />
                    <Route path="qna/*" element={<Qna />} />
                </Routes>
            </div>
        </div>
    )
}