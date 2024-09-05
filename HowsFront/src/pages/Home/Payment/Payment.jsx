import styles from './Payment.module.css'
import img1 from "../../../assets/images/interior_1.jpg";
import Postcode from "react-daum-postcode";
import React, {useState} from "react";

export const Payment = () => {

  const [postcode, setPostcode] = useState(false);

  /** postcode data set **/
  const completeHandler = (data) => {
    console.log("data ==== ", data);
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        주문하기
      </div>
      <div className={styles.subTitle}>
        선택한 상품 및 배송 정보
      </div>
      <div className={styles.orderInfo}>
        <div className={styles.items}>

          <div className={styles.item}>
            <div className={styles.itemImage}>
              <img src={img1} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span>수량 : 1</span>
                <span>76,000원</span>
              </div>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.itemImage}>
              <img src={img1} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span>수량 : 1</span>
                <span>76,000원</span>
              </div>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.itemImage}>
              <img src={img1} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span>수량 : 1</span>
                <span>76,000원</span>
              </div>
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.itemImage}>
              <img src={img1} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span>수량 : 1</span>
                <span>76,000원</span>
              </div>
            </div>
          </div>

        </div>
        <div className={styles.shipping}>
          <div className={styles.addressCheck}>
            <div>
              <input id="default" type="checkbox"/>
              <label htmlFor="default">기본 주소</label>
              <input id="direct" type="checkbox"/>
              <label htmlFor="direct">직접 입력</label>
            </div>
            <button>배송지 내역 조회</button>
          </div>

          <div className={styles.address}>
            <div className={styles.postcode}>
              <input type="text" placeholder="우편번호" readOnly/>
              <button>주소 찾기</button>
            </div>
          </div>
          <div className={styles.address}>
            <input type="text" placeholder="주소" readOnly/>
          </div>
          <div className={styles.address}>
            <input type="text" placeholder="상세 주소를 입력하세요"/>
          </div>

          <div className={styles.member}>
            <label htmlFor="">　　이름　</label>
            <input type="text" placeholder="이름을 입력하세요"/>
          </div>
          <div className={styles.member}>
            <label htmlFor="">전화번호　 </label>
            <input type="text" placeholder="' - '를 제외한 전화번호를 입력하세요"/>
          </div>

        </div>
      </div>

      <div className={styles.subTitle}>
        결제 정보
      </div>
      <div className={styles.paymentInfo}>
        <div className={styles.paymentWay}>

          <div className={styles.member}>
            <label htmlFor="">결제방식</label>
            <input type="text" placeholder="이름을 입력하세요"/>
          </div>
          <div className={styles.member}>
            <label htmlFor="">쿠폰</label>
            <input type="text" placeholder="' - '를 제외한 전화번호를 입력하세요"/>
          </div>

        </div>
        <div className={styles.paymentPrice}>
          가격
        </div>
      </div>



      {/*{ postcode &&*/}
      {/*  <Postcode onComplete={ completeHandler } />*/}
      {/*}*/}

    </div>
  );
}