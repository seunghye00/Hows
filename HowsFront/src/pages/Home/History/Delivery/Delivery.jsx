import styles from "./Delivery.module.css"
import React, {useEffect, useState} from 'react'
import {myPayments, myPaymentsDetail} from "../../../../api/history";
import {TextBox} from "../TextBox/TextBox";
import {Modal} from "../../../../components/Modal/Modal";
import {api} from "../../../../config/config";
import {addCommas, formatDate} from "../../../../commons/commons";

export const Delivery = () => {

  const [myPayment, setMyPayment] = useState([]);

  const [orderDetail, setOrderDetail] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetail = (seq) => {
    myPaymentsDetail(seq).then(res => {
      console.log("order ==== ", res.data);
      setOrderDetail(res.data);
      setIsModalOpen(true);
    });
  }

  useEffect(() => {
    myPayments().then(res => {
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
                  <p onClick={() => handleDetail(item.order_seq)}>{item.order_name}</p>
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

      {
        /* 주문 & 결제 내역 디테일 */
        isModalOpen &&
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className={styles.modalBox}>
            <p>주문자 : {orderDetail.orderDetail.orderer_name}</p><br/>
            <p>연락처 : {orderDetail.orderDetail.orderer_phone}</p><br/>
            <p>배송지 : {orderDetail.orderDetail.orderer_address} {orderDetail.orderDetail.orderer_detail_address}</p><br/>
            <p>주문날짜 : {formatDate(orderDetail.orderDetail.order_date)}</p><br/>
            <p>총 결제금액 : {orderDetail.orderDetail.order_price}</p><br/>
            <p>배송 상품</p><br/>
            <div className={styles.orderList}>
              {
                orderDetail.orderList.map(item => {
                  return (
                    <div className={styles.orderProduct} key={item.product_seq}>
                      <div className={styles.image}>
                        <img src={item.product_thumbnail} alt="상품이미지"/>
                      </div>
                      <div className={styles.info}>
                        <p>{item.product_title}</p>
                        <div className={styles.count}>
                          <span>수량 : {item.order_list_count}</span>
                          <span>{addCommas(item.order_list_price)}원</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </Modal>
      }

    </div>
  )
}