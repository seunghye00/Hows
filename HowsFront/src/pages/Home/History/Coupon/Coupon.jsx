import React, {useEffect, useState} from "react"
import styles from "./Coupon.module.css"
import {formatDate} from "../../../../commons/commons";
import {TextBox} from "../TextBox/TextBox";
import {myCoupon} from "../../../../api/history";

export const Coupon = () => {
  const [myCoupons, setMyCoupons] = useState([]);
  const [selectCoupon, setSelectCoupon] = useState([]);
  const [select, setSelect] = useState(0);

  const handleSelect = (e) => {
    console.log(e.target.value);
    setSelect(parseInt(e.target.value));
  }

  useEffect(() => {
    setSelectCoupon(myCoupons);
    if(select === 1) {
      setSelectCoupon(prev =>
        prev.filter(item => {
          return item.use_date === undefined
        })
      )
    }
    if(select === 2) {
      setSelectCoupon(prev =>
        prev.filter(item => {
          return item.use_date !== undefined
        })
      )
    }
  }, [select]);

  useEffect(() => {
    myCoupon().then(res => {
      setMyCoupons(res.data);
      setSelectCoupon(res.data);
    });
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.couponFormTop}>
        <div className={styles.countCoupons}>
          <select onChange={handleSelect}>
            <option value={0}>전체 쿠폰</option>
            <option value={1}>사용 가능</option>
            <option value={2}>사용한 쿠폰</option>
          </select>
        </div>
        <div className={styles.countCoupons}>
          <span>{selectCoupon.length}</span>
          <span>개의 쿠폰</span>
        </div>
      </div>
      {
        selectCoupon.length > 0 ?
          <>
            {
              selectCoupon.map(item => {
                return (
                  <div className={styles.couponBox} key={item.coupon_owner_seq}>
                    {
                      item.use_date === undefined ?
                        <>
                          <div className={styles.eventName}>
                            <span className={styles.title}>{item.coupon_title}</span>
                          </div>
                          <span className={styles.expiredDate}>{formatDate(item.expired_date)} 까지</span>
                        </>
                        :
                        <>
                          <div className={styles.eventName} style={{color: "var(--hows-gray-300)"}}>
                            <span className={styles.title}>{item.coupon_title}</span>
                          </div>
                          <span className={styles.useDate}>{formatDate(item.use_date)} 사용</span>
                        </>
                    }
                  </div>
                )
              })
            }
          </>
          :
          <TextBox text={"보유한 쿠폰이"}/>
      }
    </div>
  )
}