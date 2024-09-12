import styles from "./BuyList.module.css";
import {useEffect, useState} from "react";
import {formatDate} from "../../../../commons/commons";
import {useNavigate} from "react-router-dom";
import {myOrders} from "../../../../api/history";
import {TextBox} from "../TextBox/TextBox";

export const BuyList = ({data}) => {

  const navi = useNavigate();

  const [myOrder, setMyOrder] = useState([]);

  useEffect(() => {
    myOrders().then(res => {
      setMyOrder(res.data);
    });
  }, []);

  return (
    <div className={styles.container}>
      {
        myOrder.length > 0 &&
        <div className={styles.countProducts}>
          <span>{myOrder.length}</span>
          <span>개의 상품</span>
        </div>
      }
      {
        myOrder.length > 0 ?
          myOrder.map(items => {
            return items.myOrderList.map(item => {
              return (
                <div className={styles.item} key={item.order_list_seq}>
                  <div className={styles.itemImage}>
                    <img src={item.product_thumbnail} alt="상품이미지"/>
                  </div>
                  <div className={styles.itemInfo}>
                    <p onClick={() => navi(`/products/${item.product_seq}`)}>{item.product_title}</p>
                    <div className={styles.itemCount}>
                      <span>{formatDate(items.myOrder.order_date)}</span>
                      <span>수량 : {item.order_list_count}</span>
                      <span>{item.order_list_price}원</span>
                    </div>
                  </div>
                </div>
              )
            });
          })
          :
          <TextBox text={"구매한 상품이"}/>
      }

    </div>
  )
}