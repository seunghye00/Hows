import React, {useEffect, useState} from "react"
import styles from "./Coupon.module.css"
import {formatDate} from "../../../../commons/commons";
import {TextBox} from "../TextBox/TextBox";
import {myCoupon} from "../../../../api/history";

export const Coupon = () => {
  const [myCoupons, setMyCoupons] = useState([]);

  useEffect(() => {
    myCoupon().then(res => {
      console.log(res.data);
      setMyCoupons(res.data);
    });
  }, []);


  return (
    <div className={styles.container}>
      {
        myCoupons.length > 0 ?
          <>
            <div className={styles.countCoupons}>
              <span>{myCoupons.length}</span>
              <span>개의 쿠폰</span>
            </div>
            {
              myCoupons.map((item, i) => {
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