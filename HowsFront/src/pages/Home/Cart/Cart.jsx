import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addCommas, shippingPrice, SwalComp } from "../../../commons/commons";
import { useOrderStore } from "../../../store/orderStore";
import { cartList, deleteCart, updateCart } from "../../../api/cart";
import { useAuthStore } from "../../../store/store";
import { TextBox } from "../History/TextBox/TextBox";

export const Cart = () => {
  const navi = useNavigate();

  const { isAuth } = useAuthStore();

  const { setOrderProducts, setOrderPrice } = useOrderStore();

  // 장바구니 목록 원본 데이터
  const [carts, setCarts] = useState([]);

  // 장바구니 체크 데이터
  const [checkCart, setCheckCart] = useState([]);

  // 전체 선택, 해제
  const [allChecked, setAllChecked] = useState(true);

  // 선택된 상품의 총 개수, 가격
  const [total, setTotal] = useState({ count: 0, price: 0 });

  /** 상품 총 개수, 가격 **/
  const totalPrice = () => {
    let price = 0;
    let count = 0;
    checkCart.forEach((item) => {
      if (item.checked) {
        price += item.cart_price;
        count++;
      }
    });
    setTotal((prev) => ({ count, price }));
  };

  /** 상품 체크 **/
  const handleCheck = (e) => {
    const { name, checked } = e.target;
    if (name === "all") {
      setCheckCart((prev) => {
        return prev.map((item) => ({ ...item, checked }));
      });
    } else {
      setCheckCart((prev) => {
        return prev.map((item) =>
          item.cart_seq === Number(name) ? { ...item, checked } : item
        );
      });
    }
  };

  /** 수량 추가 ( 수량, 가격 ) **/
  const handleCount = (seq, symbol) => {
    setCheckCart((prev) => {
      return prev.map((item) => {
        if (item.cart_seq === seq) {
          let newQuantity = item.cart_quantity;
          let newPrice = item.cart_price;

          if (symbol === "+") {
            newQuantity += 1;
            newPrice += item.price;
          } else if (symbol === "-") {
            newPrice = newQuantity === 1 ? newPrice : newPrice - item.price;
            newQuantity = newQuantity === 1 ? newQuantity : newQuantity - 1;
          }
          const result = {
            cart_seq: item.cart_seq,
            cart_quantity: newQuantity,
            cart_price: newPrice,
          };
          updateCart(result);
          return { ...item, cart_quantity: newQuantity, cart_price: newPrice };
        }
        return item;
      });
    });
  };

  /** 선택 및 개별 상품 구입 **/
  const handleOrder = (seq) => {
    let data = [];
    if (Array.isArray(seq)) {
      data = seq;
    } else {
      if (total.count === 0) {
        return SwalComp({
          type: "warning",
          text: "선택한 상품이 없습니다.",
        });
      }
      checkCart.forEach((item) => {
        if (item.checked) data.push(item.cart_seq);
      });
    }

    let dataArr = checkCart.filter((item) => {
      return data.includes(item.cart_seq);
    });

    let order = [];
    let orderPrice = 0;
    dataArr.forEach((item) => {
      const dataSet = {
        product_seq: item.product_seq,
        product_title: item.product_title,
        product_image: item.product_thumbnail,
        product_quantity: item.cart_quantity,
        product_total_price: item.cart_price,
      };
      if (item.cart_quantity > item.quantity) {
        SwalComp({
          type: "warning",
          text: item.product_title + "의 재고가 부족합니다",
        });
        return false;
      }
      orderPrice += item.cart_price;
      order.push(dataSet);
    });

    setOrderPrice(orderPrice);
    setOrderProducts(order);
    sessionStorage.setItem("howsOrder", JSON.stringify(order));
    sessionStorage.setItem("howsPrice", orderPrice);
    navi("/payment");
  };

  /** 선택 및 개별 상품 삭제 **/
  const handleDelete = (seq) => {
    let data = [];
    if (Array.isArray(seq)) {
      data = seq;
    } else {
      checkCart.forEach((item) => {
        if (item.checked) data.push(item.cart_seq);
      });
    }
    SwalComp({
      type: "question",
      text: "상품을 장바구니에서 삭제하시겠습니까?",
    }).then((res) => {
      if (res.isConfirmed) {
        setCheckCart((prev) => {
          let arr = prev;
          data.forEach((seq) => {
            arr = arr.filter((item) => {
              if (item.cart_seq === seq) {
                deleteCart(seq);
              }
              return item.cart_seq !== seq;
            });
          });
          return arr;
        });
      }
    });
    // if(window.confirm("상품을 장바구니에서 삭제하시겠습니까?")){
    //   setCheckCart(prev => {
    //     let arr = prev;
    //     data.forEach(seq => {
    //       arr = arr.filter(item => {
    //         if(item.cart_seq === seq){
    //           deleteCart(seq);
    //         }
    //         return item.cart_seq !== seq;
    //       });
    //     });
    //     return arr;
    //   });
    // }
  };

  useEffect(() => {
    setCheckCart(carts);
  }, [carts]);

  /** 전체선택 **/
  useEffect(() => {
    const isAllChecked = checkCart.every((item) => item.checked);
    setAllChecked(isAllChecked);
    totalPrice();
  }, [checkCart]);

  /** 페이지 로드 **/
  useEffect(() => {
    if (!isAuth) {
      SwalComp({
        type: "warning",
        text: "로그인이 필요한 서비스입니다.",
      });
      navi("/signIn");
    }

    cartList().then((res) => {
      if (res !== "" && res !== undefined && res !== null) {
        const arr = res.data.map((item) => ({ ...item, checked: true }));
        setCarts(arr);
        setCheckCart(arr);
        totalPrice();
      }
    });
  }, [isAuth]);

  if (!isAuth) return null;
  return (
    <div className={styles.container}>
      <div className={styles.title}>장바구니</div>
      {carts.length <= 0 ? (
        <div className={styles.noneItem}>
          <TextBox text={"장바구니에 등록된 상품이"} />
        </div>
      ) : (
        <>
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
                <p>{addCommas(total.price)}원</p>
                <p>{addCommas(shippingPrice(total.price))}원</p>
                <p>{addCommas(total.price + shippingPrice(total.price))}원</p>
              </div>
            </div>
          </div>
          <div className={styles.itemForm}>
            <div className={styles.btnBox}>
              <input
                type="checkbox"
                name="all"
                onChange={handleCheck}
                checked={allChecked}
              />
              <button onClick={handleDelete}>선택 삭제</button>
            </div>
            <div className={styles.items}>
              {checkCart.map((item) => {
                return (
                  <div className={styles.item} key={item.cart_seq}>
                    <input
                      type="checkbox"
                      name={item.cart_seq}
                      onChange={handleCheck}
                      checked={item.checked}
                    />
                    <div className={styles.itemImage}>
                      <img src={item.product_thumbnail} alt="상품이미지" />
                    </div>
                    <div className={styles.itemInfo}>
                      <p onClick={() => navi(`/products/${item.product_seq}`)}>
                        {item.product_title}
                      </p>
                      <div className={styles.itemCount}>
                        <span> 수량 : </span>
                        <button onClick={() => handleCount(item.cart_seq, "-")}>
                          -
                        </button>
                        <span>{item.cart_quantity}</span>
                        <button onClick={() => handleCount(item.cart_seq, "+")}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className={styles.itemPrice}>
                      <p>{addCommas(item.cart_price)}원</p>
                      <button onClick={() => handleOrder([item.cart_seq])}>
                        구입
                      </button>
                      <button onClick={() => handleDelete([item.cart_seq])}>
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
