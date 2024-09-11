import styles from "./BuyList.module.css";
import {useEffect, useState} from "react";
import {api} from "../../../../config/config";
import {formatDate} from "../../../../commons/commons";

export const BuyList = ({ data }) => {

    const list = [
        {
            product_seq: 1,
            product_title: '푹신푹신 침대',
            product_quantity: 1,
            product_total_price: 10000
        },
        {
            product_seq: 2,
            product_title: '너무너무 졸려요',
            product_quantity: 100,
            product_total_price: 9990000
        },
        {
            product_seq: 3,
            product_title: '배도 고프구요',
            product_quantity: 5,
            product_total_price: 3000
        },
    ]

    const [myOrder, setMyOrder] = useState([]);

    useEffect(() => {
        // 주문 내역
        api.get(`/history/order`).then(res => {
            console.log("res ==== ", res);
            setMyOrder(res.data);
        });

        // 구매 상품 내역


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
                                  <p>{item.product_title}</p>
                                  <div className={styles.itemCount}>
                                      구입일 : {formatDate(items.myOrder.order_date)}
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