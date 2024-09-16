import styles from "./Delivery.module.css"
import React, {useEffect, useState} from 'react'
import {myPayments, myPaymentsDetail} from "../../../../api/history";
import {TextBox} from "../TextBox/TextBox";
import {Modal} from "../../../../components/Modal/Modal";
import {api} from "../../../../config/config";
import {addCommas, formatDate} from "../../../../commons/commons";
import {useNavigate} from "react-router-dom";
import {paymentCancel} from "../../../../api/payment";

export const Delivery = () => {

  const navi = useNavigate();

  const [myPayment, setMyPayment] = useState([]);
  const [selectPayment, setSelectPayment] = useState(0);
  const [orderDetail, setOrderDetail] = useState([]);
  const [reason, setReason] = useState()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetail = (seq, paymentSeq) => {
    myPaymentsDetail(seq).then(res => {
      setOrderDetail(res.data);
      setSelectPayment(paymentSeq);
      setIsModalOpen(true);
    });
  }

  const handleReason = (e) => {
    setReason(e.target.value);
  }

  const handleSaleCancel = (seq) => {
    const params = {
      payment_seq: seq,
      payment_text: reason
    }
    api.post(`/history/payment/cancel`, params).then(res => {
      console.log("res ==== ", res);
    })
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
                  <p onClick={() => handleDetail(item.order_seq, item.payment_seq)}>{item.order_name}</p>
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
        /** 주문 & 결제 내역 디테일 **/
        isModalOpen &&
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className={styles.modalBox}>
            <div className={styles.orderDetail}>
              <p>주문자 : {orderDetail.orderDetail.orderer_name}</p>
              <p>연락처 : {orderDetail.orderDetail.orderer_phone}</p>
              <p>배송지 : {orderDetail.orderDetail.orderer_address} {orderDetail.orderDetail.orderer_detail_address}</p>
              <p>주문날짜 : {formatDate(orderDetail.orderDetail.order_date)}</p>
              <p>총 결제금액 : {addCommas(orderDetail.orderDetail.order_price)}원</p>
            </div>
            <div className={styles.orderList}>
              {
                orderDetail.orderList.map(item => {
                  return (
                    <div className={styles.orderProduct} key={item.product_seq}>
                      <div className={styles.image}>
                        <img src={item.product_thumbnail} alt="상품이미지"/>
                      </div>
                      <div className={styles.info}>
                        <p onClick={() => navi(`/products/${item.product_seq}`)}>{item.product_title}</p>
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
            <input type="text" onChange={handleReason} placeholder="취소 사유를 적어주세요"/>
            <button onClick={() => handleSaleCancel(selectPayment)}>구매 취소 요청</button>
          </div>
        </Modal>
      }

    </div>
  )
}