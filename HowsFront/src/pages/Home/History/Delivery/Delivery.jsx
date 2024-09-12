import styles from "./Delivery.module.css"
import React, {useEffect, useState} from 'react'
import {myPayments} from "../../../../api/history";
import {TextBox} from "../TextBox/TextBox";

export const Delivery = () => {

  const [myPayment, setMyPayment] = useState([]);

  useEffect(() => {
    myPayments().then(res => {
      console.log("res ==== ", res);
      setMyPayment(res.data);
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.shippinglist}>
        {
          myPayment.length > 0 &&
          <div className={styles.shippingHeader}>
            <div className={styles.headerItem}>주문번호</div>
            <div className={styles.headerItem}>주문내역</div>
            <div className={styles.headerItem}>결제</div>
            <div className={styles.headerItem}>배송현황</div>
          </div>
        }
        {
          myPayment.length > 0 ?
            myPayment.map(item => (
              <div className={styles.shippingRow} key={item.order_seq}>
                <div className={styles.shippingItem}>How's-order_{item.order_seq}</div>
                <div className={styles.shippingItem}>
                  <span>{item.order_name}</span>
                </div>
                <div className={styles.shippingItem}>
                  <span>{item.payment_title}</span>
                </div>
                <div className={styles.shippingItem}>배송 준비중</div>
              </div>
            ))
            :
            <TextBox text={"주문 내역이"}/>
        }
      </div>
    </div>
  )
}