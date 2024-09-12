import styles from "./Review.module.css"
import {useEffect, useState} from "react";
import {api} from "../../../../config/config";
import {formatDate} from "../../../../commons/commons";
import StarRating from "../../../../components/StarRating/StarRating";
import {myReview, myReviews} from "../../../../api/history";
import {TextBox} from "../TextBox/TextBox";

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
    myReviews().then(res => {
      setMyReview(res.data);
    });
  }, []);

  return (
    <div className={styles.container}>
      {
        myReview.length > 0 &&
        <div className={styles.countProducts}>
          <span>{myReview.length}</span>
          <span>개의 리뷰</span>
        </div>
      }
      {
        myReview.length > 0 ?
          myReview.map(item => {
            const contents = item.myReview.review_contents;
            return (
              <div className={styles.item} key={item.myReview.review_seq}>
                <div className={styles.itemImage}>
                  <img src={item.myReviewImage[0].image_url} alt="상품이미지"/>
                </div>
                <div className={styles.itemInfo}>
                  <p>{contents.length > 20 ? contents.slice(0, 19) : contents}</p>
                  <div className={styles.itemCount}>
                    <span>{formatDate(item.myReview.review_date)}</span>
                    <span><StarRating rating={item.myReview.rating}/></span>
                    <span>상품 : <a
                      href={`/products/${item.myReview.product_seq}`}>{item.myReview.product_title}</a></span>
                  </div>
                </div>
              </div>
            );
          })
          :
          <TextBox text={"작성한 리뷰가"}/>
      }
    </div>
  )
}