import styles from "./BuyList.module.css";
import {useEffect, useState} from "react";
import {api} from "../../../../config/config";
import {formatDate} from "../../../../commons/commons";
import {useNavigate} from "react-router-dom";

export const BuyList = ({ data }) => {

    const navi = useNavigate();

    const [myOrder, setMyOrder] = useState([]);

    useEffect(() => {
        // 주문 내역
        api.get(`/history/order`).then(res => {
            setMyOrder(res.data);
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.countProducts}>
                <span>{myOrder.length}</span>
                <span>개의 상품</span>
            </div>
            {
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
            }

        </div>
    )
}