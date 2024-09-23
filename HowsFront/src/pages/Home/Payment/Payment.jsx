import styles from './Payment.module.css'
import React, {useEffect, useState} from "react";
import {useOrderStore} from "../../../store/orderStore";
import {addCommas, shippingPrice, SwalComp, validateName, validatePhone} from "../../../commons/commons";
import {paymentCancel, requestPaymentEvent} from "../../../api/payment";
import { v4 as uuidv4 } from 'uuid';
import {userInfo} from "../../../api/member";
import {Modal} from "../../../components/Modal/Modal";
import DaumPostcode from "react-daum-postcode";
import {useNavigate} from "react-router-dom";
import {myCoupon} from "../../../api/history";

export const Payment = () => {

  const { orderPrice, setOrderPrice, orderProducts, setOrderProducts, setPaymentInfo } = useOrderStore();

  const navi = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Daum PostCode
  const [postcode, setPostcode] = useState(false);

  // Member 정보
  const [member, setMember] = useState({});

  // Coupon 목록
  const [coupon, setCoupon] = useState([]);

  // 가격 정보
  const [paymentPrice, setPaymentPrice] = useState({ price: orderPrice, coupon: 0, point: 0, shipping: 0, total: 0 });
  
  // 필수 동의 항목
  const [consent, setConsent] = useState({category1: false, category2: false, category3: false});

  // 주소 체크 항목
  const [addressCheck, setAddressCheck] = useState({ default: true, direct: false });

  // 주문 데이터
  const [data, setData] = useState({
    member_seq: 0,
    name: "",
    phone: "",
    email:"",
    zip_code: "",
    address: "",
    detail_address: "",
    way: "",
    coupon: 0,
    point: 0,
  });

  /** 주소 찾기 **/
  const handleAddress = () => {
    SwalComp({ type: "confirm", text: "주소를 변경하시곘습니까?" }).then(res => {
      if(res) {
        setAddressCheck(prev => ({ default: false, direct: true }));
        setIsModalOpen(true);
      }
    });
  }

  /** postcode data set **/
  const completeHandler = (data) => {
    setIsModalOpen(false);
    setData(prev => ({
      ...prev,
      zip_code: data.zonecode,
      address: data.address
    }));
  }

  /** 동의 항목 체크 **/
  const handleCheck = (e) => {
    const {id, name, checked} = e.target;
    if(name === "addressOption") {
      setAddressCheck(prev => ({
        default: id === "default" ? checked : false,
        direct: id === "direct" ? checked : false,
      }));
    } else {
      setConsent(prev => ({ ...prev, [name]: checked }));
    }
  }

  /** 주문 정보 ( 이름, 전화번호, 주소, 결제방식, 쿠폰, 포인트 ) **/
  const handleData = (e) => {
    let { name, value } = e.target;
    if(name === "point") {
      if(value === "") value = 0;
      if(value <= member.point) setData(prev => ({ ...prev, point: parseInt(value) }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  }

  /** 결제방식 선택 **/
  const handleWay = (e) => {
    let { name } = e.target;
    setData(prev => ({ ...prev, way: name }));
  }

  /** 결제 이벤트 **/
  const handlePayment = async () => {

    if(!validateName(data.name)) {
      SwalComp({type: "warning", text: "이름을 확인해주세요"});
      return false;
    }
    
    if(!validatePhone(data.phone)){
      SwalComp({type: "warning", text: "전화번호를 확인해주세요"});
      return false;
    }

    if(data.zip_code === "" || data.address === "" || data.detail_address === "") {
      SwalComp({type: "warning", text: "배송지를 입력해주세요"});
      return false;
    }

    if(data.way === "") {
      SwalComp({type: "warning", text: "결제 방식을 선택하세요"});
      return false;
    }

    if(!consent.category1 || !consent.category2 || !consent.category3) {
      SwalComp({type: "warning", text: "필수 동의 항목을 체크해주세요"});
      return false;
    }

    // payment parameter setting
    const name = orderProducts[0].product_title.length > 10 ? orderProducts[0].product_title.slice(0,9) + "..." : orderProducts[0].product_title;
    const count = orderProducts.length > 1 ? ` 외 ${orderProducts.length-1}종` :  "";
    const paymentId = `how-${uuidv4()}`
    const orderName = name + count;
    const totalAmount = paymentPrice.total - paymentPrice.point;
    // const payMethod = data.way;
    const payMethod = "CARD";
    const customer = {
      fullName: data.name,
      phoneNumber: data.phone,
      email: data.email
    }

    // order info setting
    const orderInfo = {
      orderName,
      totalAmount,
      orderProducts,
      name: data.name,
      phone: data.phone,
      zipCode: data.zip_code,
      address: data.address,
      detailAddress: data.detail_address,
      couponOwnerSeq: data.coupon
    }

    // payment info setting
    const paymentInfo = {
      paymentId,
      orderName,
      totalAmount, 
      payMethod,
      customer
    };

    setPaymentInfo({ orderName, totalAmount });

    // 결제 진행
    const resultData = await requestPaymentEvent(paymentInfo, orderInfo);
    
    // 결제 상태
    if(resultData === "ok") {
      SwalComp({ type: "success", text: "구매내역 보기" }).then(resp => {
        if(resp) navi("/history/delivery");
        else navi("/");
      });
    } else {
      // 실패 시 결제 취소
      paymentCancel(paymentId).then(res => {
        SwalComp({
          text:"결제가 취소되었습니다."
        });
      });
    }
  }

  /** 회원 정보 셋팅 **/
  const memberSet = () => {
    userInfo().then(res =>{
      const { member_seq, name, phone, email, zip_code, address, detail_address, point } = res.data;
      const memberData = { member_seq, name, phone, email, zip_code, address, detail_address, point }
      setMember(memberData);
      setData(prev => ({ ...prev, ...memberData, point: 0 }));
    });
  }

  /** 쿠폰 선택시 할인 가격 계산 **/
  useEffect(() => {
    let discount = "";
    coupon.forEach(item => {
      if(parseInt(item.coupon_owner_seq) === parseInt(data.coupon)) discount = item.coupon_discount;
    });
    const result = `${orderPrice.toString()}${discount}`;
    setPaymentPrice(prev => {
      return {
        ...prev,
        coupon: paymentPrice.price-eval(result),
        total: eval(result) + shippingPrice(eval(result))
      }
    });

  }, [data.coupon]);

  /** 새로고침 시 세션에서 order list 가져옴 **/
  useEffect(() => {
    const item = sessionStorage.getItem("howsOrder");
    const price = sessionStorage.getItem("howsPrice");

    if(item === null || price === null) {
      SwalComp({
        type:"error",
        text:"선택한 상품이 없습니다."
      });
      return navi("/");
    }

    if(orderProducts.length <= 0){
      if(data !== null){
        const order = JSON.parse(item);
        setOrderProducts(order);
        setOrderPrice(parseInt(price));

        setPaymentPrice(prev => ({
          ... prev,
          price: parseInt(price),
          shipping: shippingPrice(parseInt(price)),
          // total: parseInt(price)
          total: parseInt(price) + shippingPrice(price)
        }));
      }
    }

    // 멤버 정보 셋팅
    memberSet();

    // 2. 회원이 소유한 쿠폰 리스트
    myCoupon().then(res => {
      setCoupon(res.data);
    });

  }, []);


  useEffect(() => {
      setData(prev => {
        if (addressCheck.default) return { ...prev, zip_code: member.zip_code, address: member.address, detail_address: member.detail_address };
        if (addressCheck.direct) return { ...prev, zip_code: "", address: "", detail_address: "" };
        return prev;
      });
  }, [addressCheck, member]);

  useEffect(() => {
    // setPaymentPrice(prev => ({ ...prev, point: data.point, shipping: shippingPrice(prev.price), total: prev.price - prev.coupon}));
    setPaymentPrice(prev => ({ ...prev, point: data.point, shipping: shippingPrice(prev.price), total: prev.price - prev.coupon + shippingPrice(prev.price)}));
  }, [data.point]);

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
              <input id="default" name="addressOption" onChange={handleCheck} type="radio" checked={addressCheck.default}/>
              <label htmlFor="default">기본 주소</label>
              <input id="direct" name="addressOption" onChange={handleCheck} type="radio" checked={addressCheck.direct}/>
              <label htmlFor="direct">직접 입력</label>
            </div>
            {/*<button onClick={handleOrderHistory}>배송지 내역 조회</button>*/}
          </div>
          <div className={styles.address}>
            <div className={styles.postcode}>
              <input type="text" placeholder="우편번호" value={data.zip_code} readOnly/>
              <button onClick={handleAddress}>주소 찾기</button>
            </div>
          </div>
          <div className={styles.address}>
            <input type="text" placeholder="주소" value={data.address} readOnly/>
          </div>
          <div className={styles.address}>
            <input type="text" name="detail_address" value={data.detail_address || ""} placeholder="상세 주소를 입력하세요" onChange={handleData}/>
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
              <button name="CARD" style={ data.way === "CARD" ? {backgroundColor:"var(--hows-point-color)", color: "white"} : null } onClick={handleWay}>카드</button>
              <button name="KAKAO" style={ data.way === "KAKAO" ? {backgroundColor:"var(--hows-point-color)", color: "white"} : null } onClick={handleWay}>카카오 페이</button>
              <button name="TOSS" style={ data.way === "TOSS" ? {backgroundColor:"var(--hows-point-color)", color: "white"} : null } onClick={handleWay}>토스 페이</button>
            </div>
          </div>
          <div className={styles.payment}>
            <p>Coupon</p>
            <select name="coupon" onChange={handleData}>
              <option value={0}>쿠폰을 선택하세요</option>
              {
                coupon.map(item => {
                  return (
                    <option value={item.coupon_owner_seq} key={item.coupon_owner_seq}>
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
              <input type="text" value={member.point-data.point || 0} readOnly/>
              <span>p 보유</span>
              <input type="text" name="point" onChange={handleData} value={data.point || 0}/>
              <span>p 사용</span>
            </div>
          </div>
        </div>

        {/* 가격 */}
        <div className={styles.paymentPrice}>
          <div className={styles.priceInfo}>
            <div>
              <p>가격 : </p>
              <p>쿠폰 할인가 : </p>
              <p>사용 포인트 : </p>
              <p>배송비 : </p>
              <p>총 결제 금액 : </p>
            </div>
            <div>
              <p>{addCommas(paymentPrice.price)} 원</p>
              <p>{addCommas(paymentPrice.coupon)} 원</p>
              <p>{paymentPrice.point || 0} P</p>
              <p>{addCommas(paymentPrice.shipping)} 원</p>
              <p>{addCommas(paymentPrice.total - paymentPrice.point)} 원</p>
            </div>
          </div>

          <div className={styles.consent}>
            <input name="category1" id="category1" checked={consent.category1} type="checkbox" onChange={handleCheck}/>
            <label htmlFor="category1">
              (필수) 개인정보 수집/이용 동의 보기
            </label>
          </div>
          <div className={styles.consent}>
            <input name="category2" id="category2" checked={consent.category2} type="checkbox" onChange={handleCheck}/>
            <label htmlFor="category2">
              (필수) 개인정보 제3자 제공 동의 보기
            </label>
          </div>
          <div className={styles.consent}>
            <input name="category3" id="category3" checked={consent.category3} type="checkbox" onChange={handleCheck}/>
            <label htmlFor="category3">
              (필수) 결제대행 서비스 이용약관
              <a href="https://www.inicis.com/terms"> (주)KG이니시스</a>
            </label>
          </div>
          <button onClick={handlePayment}>결제하기</button>
        </div>

      </div>

      {
        isModalOpen &&
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className={styles.modalBox}>
            <DaumPostcode onComplete={ completeHandler } style={{height: '95%'}} />
          </div>
        </Modal>
      }
    </div>
  );
}