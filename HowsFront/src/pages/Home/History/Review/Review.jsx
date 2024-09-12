import styles from "./Review.module.css"
import {useEffect, useState} from "react";
import {api} from "../../../../config/config";

export const Review = () => {
    const list = [
        {
            product_seq: 1,
            product_title: '푹신푹신 침대',
            product_quantity: 1,
            product_category_title: '가구'
        },
        {
            member_id: "vmfpsel",
            product_seq: 2,
            rating: 1,
            review_contents: "반품이 안된답니다. 화가 납니다",
            review_date: "2024-09-11T15:20:07.000+00:00",
            review_seq: 42
        },
    ]

    const [myReview, setMyReview] = useState([]);

    useEffect(() => {
        api.get(`/history/review`).then(res => {
            console.log("res ===== ", res);
            setMyReview(res.data);
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.countProducts}>
                <span>{myReview.length}</span>
                <span>개의 리뷰</span>
            </div>
            {
                list.map((item, i) => {
                    return (
                        <div className={styles.item} key={item.product_seq}>
                            <div className={styles.itemImage}>
                                <img src={item.product_image} alt="상품이미지" />
                            </div>
                            <div className={styles.itemInfo}>
                                <p>{item.product_title}</p>
                                <div className={styles.itemCount}>
                                    <span>{item.product_category_title}</span>
                                    <span>수량 : {item.product_quantity}</span>
                                    {/* <span>{addCommas(item.product_total_price)}원</span> */}
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}