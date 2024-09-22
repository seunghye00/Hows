import styles from "./History.module.css";
import {Routes, Route, Navigate, useNavigate, useLocation} from "react-router-dom";
import {Review} from './Review/Review';
import {Delivery} from './Delivery/Delivery';
import {Coupon} from './Coupon/Coupon';
import {useEffect, useState} from "react";
import {myInfo} from "../../../api/history";
import {addCommas} from "../../../commons/commons";

export const History = () => {
  const navi = useNavigate();
  const location = useLocation();

  const [nextGradeInfo, setNextGradeInfo] = useState({title: "", price: 0});

  const [info, setInfo] = useState({
    GRADE_CODE: "",
    GRADE_TITLE: "",
    POINT: 0,
    totalPrice: 0
  });

  // 데이터화 해야됨( 테이블 필요 )
  const nextGrade = (code) => {
    switch (code) {
      case "G2":
        setNextGradeInfo({title: "골드", price: 3000000});
        break;
      default :
        setNextGradeInfo({title: "실버", price: 1000000});
        break;
    }
  }

  useEffect(() => {
    myInfo().then(res => {
      setInfo(res.data);
      nextGrade(res.data.GRADE_CODE);
    })
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.pointBox}>
        <div>
          <p>회원님의 등급은 <span>{info.GRADE_TITLE}</span> 입니다.</p>
          {
            info.GRADE_CODE !== "G1" &&
            <span>다음 등급({nextGradeInfo.title})까지 {addCommas(nextGradeInfo.price - info.totalPrice)}원 남았습니다.</span>
          }
          <span>총 결재 금액 : {info.totalPrice}원</span>
        </div>
        <div>
          <p>보유 포인트 : <span>{info.POINT}P</span></p>
        </div>
      </div>
      <div className={styles.menus}>
        <div className={styles.delivery}>
          <span
            onClick={() => navi("delivery")}
            className={location.pathname.includes("delivery") ? styles.active : ""}> 주문 & 결제
          </span>
        </div>
        <div className={styles.review}>
          <span
            onClick={() => navi("review")}
            className={location.pathname.includes("review") ? styles.active : ""}> 구매후기
          </span>
        </div>
        <div className={styles.coupon}>
          <span
            onClick={() => navi("coupon")}
            className={location.pathname.includes("coupon") ? styles.active : ""}> 보유쿠폰
          </span>
        </div>
      </div>
      <div className={styles.body}>
        <Routes>
          <Route path="/" element={<Navigate to="delivery" replace/>}/>
          <Route path="delivery/*" element={<Delivery/>}/>
          <Route path="review/*" element={<Review/>}/>
          <Route path="coupon/*" element={<Coupon/>}/>
        </Routes>
      </div>
    </div>
  )
}