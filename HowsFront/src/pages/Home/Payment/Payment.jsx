import styles from './Payment.module.css'
import Postcode from "react-daum-postcode";
import React, {useEffect, useState} from "react";
import {useOrderStore} from "../../../store/orderStore";
import {addCommas, shippingPrice} from "../../../commons/commons";

export const Payment = () => {

  const { orderPrice, setOrderPrice, orderProducts, setOrderProducts } = useOrderStore();

  // Daum PostCode
  const [postcode, setPostcode] = useState(false);

  // Member 정보
  const [member, setMember] = useState({});

  // Coupon 목록
  const [coupon, setCoupon] = useState([]);

  // 쿠폰 적용 가격
  const [discountPrice, setDiscountPrice] = useState(0);

  // 주문 데이터
  const [data, setData] = useState({
    member_seq: 0,
    name: "",
    phone: "",
    zip_code: "",
    address: "",
    detail_address: "",
    way: "",
    coupon: 0,
    point: 0,
  });

  /** postcode data set **/
  const completeHandler = (data) => {
    console.log("data ==== ", data);
  }

  /** 주문 정보 ( 이름, 전화번호, 주소, 결제방식, 쿠폰, 포인트 ) **/
  const handleData = (e) => {
    const { name, value } = e.target;
    if(name === "point") {
      if(value <= member.point) {
        setData(prev => ({ ...prev, point : parseInt(value) }));
      }
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  }

  /** 결제방식 선택 **/
  const handleWay = (e) => {
    let { name } = e.target;
    setData(prev => ({ ...prev, way: name }));
  }

  /** 새로고침 시 세션에서 order list 가져옴 **/
  useEffect(() => {
    if(orderProducts.length <= 0){
      const data = sessionStorage.getItem("howsOrder");
      const price = sessionStorage.getItem("howsPrice");
      if(data !== null){
        const order = JSON.parse(data);
        setOrderProducts(order);
        setOrderPrice(parseInt(price));
      }
    }

    // 1. 회원 정보 ( 주소, 이름, 전화번호 )
    const memberData = {
      member_seq: 1,
      name: "박종호",
      phone: "01087654321",
      zip_code: "35062",
      address: "충청남도 천안호두시 과자동",
      detail_address: "호두마을 100-1",
      point: 5000
    }
    setMember(memberData);
    setData(prev => ({ ...prev, ...memberData, point: 0 }));

    // 2. 회원이 소유한 쿠폰 리스트
    const couponData = [
      {
        coupon_owner_seq: 1,
        member_seq: 1,
        coupon_seq: 1,
        coupon_title: "[ 5% 할인 ] 첫번째 이벤트",
        coupon_type: "percent",
        coupon_discount: "*0.95"
      },
      {
        coupon_owner_seq: 2,
        member_seq: 1,
        coupon_seq: 2,
        coupon_title: "[ 5000원 할인 ] 두번째 이벤트",
        coupon_type: "price",
        coupon_discount: "-5000"
      },
    ]
    setCoupon(couponData);
    setDiscountPrice(orderPrice);
  }, []);

  /** 쿠폰 선택시 할인 가격 계산 **/
  useEffect(() => {
    let discount = "";
    coupon.forEach(item => {
      if(parseInt(item.coupon_seq) === parseInt(data.coupon)) discount = item.coupon_discount;
    });
    const result = `${orderPrice.toString()}${discount}`;
    setDiscountPrice(eval(result));
    
  }, [data.coupon]);

  return (
    <div className={styles.container}>
      <div className={styles.title}> 주문하기 </div>
      <div className={styles.subTitle}> 선택한 상품 및 배송 정보 </div>

      {/* 선택된 상품 목록 */}
      <div className={styles.orderInfo}>
        <div className={styles.items}>
          {
            orderProducts.length > 0 &&
            orderProducts.map(item => {
              return (
                <div className={styles.item} key={item.product_seq}>
                  <div className={styles.itemImage}>
                    <img src={item.product_image} alt="상품이미지"/>
                  </div>
                  <div className={styles.itemInfo}>
                    <p>{item.product_title}</p>
                    <div className={styles.itemCount}>
                      <span>수량 : {item.product_quantity}</span>
                      <span>{addCommas(item.product_total_price)}원</span>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
        
        {/* 배송지 정보 */}
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
              <input type="text" placeholder="우편번호" value={data.zip_code} readOnly/>
              <button>주소 찾기</button>
            </div>
          </div>
          <div className={styles.address}>
            <input type="text" placeholder="주소" value={data.address} readOnly/>
          </div>
          <div className={styles.address}>
            <input type="text" name="detail_address" value={data.detail_address} placeholder="상세 주소를 입력하세요"/>
          </div>
          <div className={styles.member}>
            <label htmlFor="">　　이름　</label>
            <input type="text" name="name" value={data.name} onChange={handleData} placeholder="이름을 입력하세요"/>
          </div>
          <div className={styles.member}>
            <label htmlFor="">전화번호　 </label>
            <input type="text" name="phone" value={data.phone} onChange={handleData} placeholder="' - '를 제외한 전화번호를 입력하세요"/>
          </div>
        </div>
      </div>

      <div className={styles.subTitle}> 결제 정보 </div>
      <div className={styles.paymentInfo}>

        {/* 결제 방식 */}
        <div className={styles.paymentWay}>
          <div className={styles.payment}>
            <p>결제방식</p>
            <div>
              <button name="card" style={ data.way === "card" ? {backgroundColor:"var(--hows-point-color)", color: "white"} : null } onClick={handleWay}>카드</button>
              <button name="kakao" style={ data.way === "kakao" ? {backgroundColor:"var(--hows-point-color)", color: "white"} : null } onClick={handleWay}>카카오 페이</button>
              <button name="toss" style={ data.way === "toss" ? {backgroundColor:"var(--hows-point-color)", color: "white"} : null } onClick={handleWay}>토스 패스</button>
            </div>
          </div>
          <div className={styles.payment}>
            <p>Coupon</p>
            <select name="coupon" onChange={handleData}>
              <option value={0}>쿠폰을 선택하세요</option>
              {
                coupon.map(item => {
                  return (
                    <option value={item.coupon_seq} key={item.coupon_owner_seq}>
                      {item.coupon_title}
                    </option>
                  );
                })
              }
            </select>
          </div>
          <div className={styles.payment}>
            <p>Point</p>
            <div>
              <input type="text" value={member.point-data.point || 0}/>
              <span>p 보유</span>
              <input type="text" name="point" onChange={handleData} value={data.point || 0}/>
              <span>p 사용</span>
            </div>
          </div>
        </div>

        {/* 가격 */}
        <div className={styles.paymentPrice}>
          <p>가격 : {addCommas(orderPrice)} 원</p>
          <p>쿠폰 할인가 : {addCommas(orderPrice-discountPrice)} 원</p>
          <p>사용 포인트 : {data.point || 0} P</p>
          <p>배송비 : {addCommas(shippingPrice(orderPrice))}원</p>
          <p>총 결제 금액 : {addCommas(discountPrice - shippingPrice(orderPrice) - data.point)}원</p>
          <button>결제하기</button>
        </div>

      </div>


      {/*{ postcode &&*/}
      {/*  <Postcode onComplete={ completeHandler } />*/}
      {/*}*/}

    </div>
  );
}