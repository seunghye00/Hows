import styles from './Cart.module.css'
import img1 from '../../../assets/images/interior_1.jpg'
import img2 from '../../../assets/images/interior_2.jpg'
import img3 from '../../../assets/images/interior_3.jpg'
import img4 from '../../../assets/images/interior_4.jpg'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export const Cart = () => {

  const navi = useNavigate();

  // 장바구니 목록 원본 데이터
  const [carts, setCarts] = useState([]);

  // 장바구니 체크 데이터
  const [checkCart, setCheckCart] = useState([]);

  // 전체 선택, 해제
  const [allChecked, setAllChecked] = useState(true);

  // 선택된 상품의 총 개수, 가격
  const [total, setTotal] = useState({count: 0, price: 0});

  /** 상품 총 개수, 가격 **/
  const totalPrice = () => {
    let price = 0;
    let count = 0;
    checkCart.forEach(item =>{
      if(item.checked) {
        price += item.cart_price;
        count++;
      }
    });
    setTotal(prev => ({ count, price }));
  }

  /** 배송비 **/
  const shippingPrice = (price) => {
    return price >= 50000 ? 0 :3000;
  }

  /** 금액에 (,)를 추가하는 함수 **/
  const addCommas = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  /** 상품 체크 **/
  const handleCheck = (e) => {
    const {name, checked} = e.target;
    if(name === "all") {
      setCheckCart(prev => {
        return prev.map(item => ({ ...item, checked}));
      });
    } else {
      setCheckCart(prev => {
        return prev.map(item => item.cart_seq === Number(name) ? { ...item, checked } : item );
      });
    }
  }

  /** 수량 추가 ( 수량, 가격 ) **/
  const handleCount = (seq, symbol) => {
    setCheckCart(prev => {
      return prev.map(item => {
        if(item.cart_seq === seq) {
          let newQuantity = item.cart_quantity;
          let newPrice = item.cart_price;

          if (symbol === "+") {
            newQuantity += 1;
            newPrice += item.price;
          } else if (symbol === "-") {
            newPrice = newQuantity === 1 ? newPrice : newPrice - item.price;
            newQuantity = newQuantity === 1 ? newQuantity : newQuantity - 1;
          }

          // (서버) 변경된 수량과 카트에 담긴 가격을 DB에 저장 로직 필요
          return { ...item, cart_quantity: newQuantity, cart_price: newPrice };
        }
        return item;
      });
    });
  }

  /** 선택 및 개별 상품 구입 **/
  const handleOrder = (seq) => {
    let data = [];
    if(Array.isArray(seq)) {
      data = seq;
    } else {
      checkCart.forEach(item => {
        if (item.checked) data.push(item.cart_seq);
      });
    }

    // (전역 상태) 선택된 상품들 결제로 넘기는 로직 필요
    navi("/payment");
  }

  /** 선택 및 개별 상품 삭제 **/
  const handleDelete = (seq) => {
    let data = [];
    if(Array.isArray(seq)) {
      data = seq;
    } else {
      checkCart.forEach(item =>{
        if(item.checked) data.push(item.cart_seq);
      });
    }
    if(window.confirm("상품을 장바구니에서 삭제하시겠습니까?")){
      setCheckCart(prev => {
        let arr = prev;
        data.forEach(seq => {
          arr = arr.filter(item => {
            if(item.cart_seq === seq){
              // (서버) 카트에서 데이터 지우는 함수
            }
            return item.cart_seq !== seq;
          });
        });
        return arr;
      });
    }
  }

  useEffect(() => {
    setCheckCart(carts);
  }, [carts]);

  /** 전체선택 **/
  useEffect(() => {
    const isAllChecked = checkCart.every(item => item.checked);
    setAllChecked(isAllChecked);
    totalPrice();
  }, [checkCart]);
  
  /** 페이지 로드 **/
  useEffect(() => {
    // 서버에서 받아올 실제 사용 데이터 ( 표본 )
    const arr = [
      {cart_seq: 1, product_seq: 1, member_seq: 1, cart_quantity: 1, cart_price: 199000, cart_date: "2024-09-05", products_thumbnail: img1, products_title: "consectetur adipisicing elit Lorem ipsum dolor sit amet, ....", product_content: "test", price: 199000, product_category_code: 1},
      {cart_seq: 2, product_seq: 2, member_seq: 1, cart_quantity: 1, cart_price: 299000, cart_date: "2024-09-05", products_thumbnail: img2, products_title: "Lorem ipsum consectetur adipisicingdolor sit amet,  elit....", product_content: "test", price: 299000, product_category_code: 1},
      {cart_seq: 3, product_seq: 3, member_seq: 1, cart_quantity: 1, cart_price: 219000, cart_date: "2024-09-05", products_thumbnail: img3, products_title: "sit amet, consecteturLorem ipsum dolor  adipisicing elit....", product_content: "test", price: 219000, product_category_code: 1},
      {cart_seq: 4, product_seq: 4, member_seq: 1, cart_quantity: 1, cart_price: 87000, cart_date: "2024-09-05", products_thumbnail: img4, products_title: "adipisicing elit Lorem ipsum dolor sit amet, consectetur ....", product_content: "test", price: 87000, product_category_code: 1}
    ]

    // 실제 데이터 + 체크 확인
    const arrData = arr.map(item => ({ ...item, checked: true }));
    setCarts(arrData);
    setCheckCart(arrData);
    totalPrice();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        장바구니
      </div>
      <div className={styles.cartInfo}>
        <div className={styles.leftBox}>
          <p>선택된 상품 ({total.count})</p>
          <button onClick={handleOrder}>주문하기</button>
        </div>
        <div className={styles.rightBox}>
          <div>
            <p>상품 금액 : </p>
            <p>배송비 : </p>
            <p>주문 금액 : </p>
          </div>
          <div>
            <p>{ addCommas(total.price) }원</p>
            <p>{ addCommas(shippingPrice(total.price)) }원</p>
            <p>{ addCommas(total.price + shippingPrice(total.price)) }원</p>
          </div>

        </div>
      </div>
      <div className={styles.itemForm}>
        <div className={styles.btnBox}>
          <input type="checkbox" name="all" onChange={handleCheck} checked={allChecked}/>
          <button onClick={handleDelete}>선택 삭제</button>
        </div>
        <div className={styles.items}>
          {
            checkCart.map(item => {
              return (
                <div className={styles.item} key={item.cart_seq}>
                  <input type="checkbox" name={item.cart_seq} onChange={handleCheck} checked={item.checked}/>
                  <div className={styles.itemImage}>
                    <img src={item.products_thumbnail} alt="상품이미지"/>
                  </div>
                  <div className={styles.itemInfo}>
                    <p>{item.products_title}</p>
                    <div className={styles.itemCount}>
                      <span> 수량 : </span>
                      <button onClick={() => handleCount(item.cart_seq, "-")}>-</button>
                      <span>{item.cart_quantity}</span>
                      <button onClick={() => handleCount(item.cart_seq, "+")}>+</button>
                    </div>
                  </div>
                  <div className={styles.itemPrice}>
                    <p>{addCommas(item.cart_price)}원</p>
                    <button onClick={() => handleOrder([item.cart_seq])}>구입</button>
                    <button onClick={() => handleDelete([item.cart_seq])}>삭제</button>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}