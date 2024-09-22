import styles from "./Delivery.module.css"
import React, {useEffect, useState} from 'react'
import {myPayments, myPaymentsDetail, requestPayment} from "../../../../api/history";
import {TextBox} from "../TextBox/TextBox";
import {Modal} from "../../../../components/Modal/Modal";
import {addCommas, formatDate, SwalComp} from "../../../../commons/commons";
import {useNavigate} from "react-router-dom";

export const Delivery = () => {

  const navi = useNavigate();

  const [myPayment, setMyPayment] = useState([]);
  const [selectPayment, setSelectPayment] = useState({paymentSeq: 0, paymentCode:""});
  const [orderDetail, setOrderDetail] = useState([]);
  const [reason, setReason] = useState("")
  const [reasonOpen, setReasonOpen] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleDetail = (seq, paymentSeq, paymentCode) => {
    myPaymentsDetail(seq).then(res => {
      setOrderDetail(res.data);
      setSelectPayment(prev => ({ paymentSeq, paymentCode}));
      setIsModalOpen(true);
    });
  }

  const handleReasonWrite = () => {
    setReasonOpen(true);
  }

  /** 결제취소 & 환불 사유 **/
  const handleReason = (e) => {
    setReason(e.target.value);
  }

  /** 결제취소 & 환불 요청 **/
  const handleSaleCancel = (seq) => {
    if(reason === "") {
      SwalComp({
        type:"warning",
        text:"사유를 입력하세요."
      });
      return false;
    }
    const params = {
      payment_seq: seq,
      payment_text: reason
    }
    requestPayment(params).then(res => {
      if(res.data === "ok"){
        // 취소 요청 완료
        SwalComp({
          type:"success",
          text:"취소 요청 되었습니다."
        });
        setIsModalOpen(false);
      }
    })
  }

  useEffect(() => {
    myPayments().then(res => {
      console.log("res.data === ", res.data);
      setMyPayment(res.data);
    });
  }, [isModalOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.shippinglist}>
        {
          myPayment.length > 0 &&
          <div className={styles.shippingHeader}>
            <div className={styles.headerItem}>주문번호</div>
            <div className={styles.headerItem}>주문내역</div>
            <div className={styles.headerItem}>결제</div>
            <div className={styles.headerItem}>주문 날짜</div>
          </div>
        }
        {
          myPayment.length > 0 ?
            myPayment.map(item => (
              <div className={styles.shippingRow} key={item.order_seq} style={item.payment_code === "P4" ? {color: "var(--hows-gray-300)"} : item.payment_code === "P5" ? {color: "var(--hows-gray-300)", textDecoration: "line-through"} : {}}>
                <div className={styles.shippingItem}>How's-order_{item.order_seq}</div>
                <div className={styles.shippingItem}>
                  <p onClick={() => handleDetail(item.order_seq, item.payment_seq, item.payment_code)}>{item.order_name}</p>
                </div>
                <div className={styles.shippingItem}>
                  <span>{item.payment_title}</span>
                </div>
                <div className={styles.shippingItem}>{formatDate(item.payment_date)}</div>
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
              <p>배송지
                : {orderDetail.orderDetail.orderer_address} {orderDetail.orderDetail.orderer_detail_address}</p>
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
            {
              selectPayment.paymentCode === "P1" || selectPayment.paymentCode === "P2" || orderDetail.orderDetail.order_code !== "O4" ?
                  <button className={styles.cancelBtn} onClick={() => handleReasonWrite(selectPayment.paymentSeq)}>구매 취소 & 환불
                    요청</button>
                  :
                  <></>
            }
            {
                reasonOpen &&
                <Modal isOpen={isModalOpen} onClose={() => setReasonOpen(false)}>
                <div className={styles.cancelReason}>
                  <textarea onChange={handleReason} value={reason || ""} placeholder="취소 사유를 적어주세요"/>
                  <button onClick={() => handleSaleCancel(selectPayment.paymentSeq)}>구매 취소 요청</button>
                </div>
              </Modal>
            }
          </div>
        </Modal>
      }

    </div>
  )
}