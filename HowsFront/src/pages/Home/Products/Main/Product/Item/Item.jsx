import styles from './Item.module.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollTop } from '../../../../../../components/ScrollTop/ScrollTop';
import { addCommas } from '../../../../../../commons/commons';
import { getBestProducts, getProductBytReview, getRandomProducts } from '../../../../../../api/product';

// 데이터를 4개씩 묶는 함수
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const Item = () => {
  const navi = useNavigate();
  const [randomProducts, setRandomProducts] = useState([]); // 상품 데이터 (랜덤순)
  const [bestProducts, setBestProducts] = useState([]); // 베스트 상품 데이터 (판매순)
  const [productBytReview, setProductBytReview] = useState([]); // 상품 데이터 (리뷰순)
  
  useEffect(() => {
    getRandomProducts().then(resp => {setRandomProducts(resp.data); }) 
    getBestProducts().then(resp => {setBestProducts(resp.data);})
    getProductBytReview().then(resp => {setProductBytReview(resp.data)})
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleItem}>오늘의 추천 상품</div>
      <div className={styles.contents}>
        {
          randomProducts.map((item) => (
            <div
              className={styles.item}
              key={item.product_seq}
              onClick={() => navi(`/products/${item.product_seq}`)}
            >
              <div className={styles.img}>
                <img src={item.product_thumbnail} alt="img" />
              </div>
              <div className={styles.title}>
                <div>
                  {item.product_title.length > 20 ? `${item.product_title.slice(0, 20)}...` : item.product_title}
                </div>
                <div>{addCommas(item.price || 0)}</div>
              </div>
            </div>
          ))
        }
      </div>
      <div className={styles.titleItem}>누적 판매 베스트 상품</div>
      <div className={styles.contents}>
      {
        bestProducts.map((item) => (
          <div
            className={styles.item}
            key={item.product_seq}
            onClick={() => navi(`/products/${item.product_seq}`)}
          >
            <div className={styles.img}>
              <img src={item.product_thumbnail} alt="img" />
            </div>
            <div className={styles.title}>
              <div>
                {item.product_title.length > 20 ? `${item.product_title.slice(0, 20)}...` : item.product_title}
              </div>
              <div>{addCommas(item.price || 0)}</div>
            </div>
          </div>
        ))
      }
      
      </div>
      <div className={styles.titleItem}>인기 급상승 상품</div>
      <div className={styles.contents}>
      {
        productBytReview.map((item) => (
          <div
            className={styles.item}
            key={item.product_seq}
            onClick={() => navi(`/products/${item.product_seq}`)}
          >
            <div className={styles.img}>
              <img src={item.product_thumbnail} alt="img" />
            </div>
            <div className={styles.title}>
              <div>
                {item.product_title.length > 20 ? `${item.product_title.slice(0, 20)}...` : item.product_title}
              </div>
              <div>{addCommas(item.price || 0)}</div>
            </div>
          </div>
        ))
      }
      
      </div>
        <ScrollTop />
    </div>
  );
}
