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
      {/* <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="제목 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div> */}

      <div className={styles.shippinglist}>
        {
          myPayment.length > 0 &&
          <div className={styles.shippingHeader}>
            <div className={styles.headerItem}>NO</div>
            <div className={styles.headerItem}>주문번호</div>
            <div className={styles.headerItem}>결제</div>
            <div className={styles.headerItem}>배송현황</div>
          </div>
        }
        {
          myPayment.length > 0 ?
            myPayment.map((item, index) => (
              <div className={styles.shippingRow} key={index}>
                <div className={styles.shippingItem}>{item.shippng_seq}</div>
                <div className={styles.shippingItem}>
                  <span className={styles.span}>How's-order-number_{item.orders_seq}</span>
                </div>
                <div className={styles.shippingItem}>
                  <span className={styles.span}>대기</span>
                </div>
                <div className={styles.shippingItem}>{item.shipping_status}</div>
              </div>
            ))
            :
            <TextBox text={"주문 내역이"}/>
        }
      </div>
    </div>
  )
}