import styles from "./History.module.css";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { BuyList } from "./BuyList/BuyList";
import { Review } from './Review/Review';
import { Delivery } from './Delivery/Delivery';
import { Coupon } from './Coupon/Coupon';

export const History = () => {
  const navi = useNavigate();
  const location = useLocation();

  // 임시 포인트
  const data = { point: 700 }

  return (
    <div className={styles.container}>
      <div className={styles.pointBox}>
        <span>포인트 : </span>
        <span>{data.point}</span>
      </div>
        <div className={styles.menus}>
            {/*<div className={styles.buyList}>*/}
            {/*            <span*/}
            {/*              onClick={() => navi("buyList")}*/}
            {/*              className={location.pathname.includes("buyList") ? styles.active : ""}*/}
            {/*            >*/}
            {/*                구매내역*/}
            {/*            </span>*/}
            {/*</div>*/}
            <div className={styles.delivery}>
                    <span
                        onClick={() => navi("delivery")}
                        className={location.pathname.includes("delivery") ? styles.active : ""}
                    >
                        주문 & 결제
                    </span>
            </div>
            <div className={styles.review}>
                    <span
                        onClick={() => navi("review")}
                        className={location.pathname.includes("review") ? styles.active : ""}
                    >
                        구매후기
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
        </div>
        <div className={styles.body}>
            <Routes>
                <Route path="/" element={<Navigate to="delivery" replace/>}/>
                {/*<Route path="buyList/*" element={<BuyList/>}/>*/}
                <Route path="delivery/*" element={<Delivery/>}/>
                <Route path="review/*" element={<Review/>}/>
                <Route path="coupon/*" element={<Coupon />} />
        </Routes>
      </div>
    </div>
  )
}