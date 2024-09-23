import styles from "./Best.module.css";
import img from "../../../../../assets/images/마이페이지_프로필사진.jpg";
import { ScrollTop } from "../../../../../components/ScrollTop/ScrollTop";
import { useEffect, useState } from "react";
import { getBestProducts } from "../../../../../api/product";
import { useNavigate } from "react-router-dom";

export const Best = () => {
  const navi = useNavigate();
  const [bestProducts, setBestProducts] = useState([]);

  // 컴포넌트가 마운트될 때 API 요청
  useEffect(() => {
    const bestProductsList = async () => {
      try {
        const result = await getBestProducts();
        setBestProducts(result.data);
      } catch (error) {
        console.error("베스트 상품 불러오기 실패", error);
      }
    };

    bestProductsList();
  }, []);

  return (
    <div className={styles.container}>
      <div style={{height:"70px"}}></div>
      <div className={styles.bestTitlt}>베스트 상품</div>
      <div className={styles.contents}>

        {bestProducts.length > 0 ? (
          bestProducts.map((product, index) => (
            <div
              key={product.product_seq}
              className={styles.item}
              onClick={() => navi(`/products/${product.product_seq}`)}
            >
              <div className={styles.bookMark}>{index + 1}</div> {/* 순위 */}
              <div className={styles.img}>
                <img
                  src={product.product_thumbnail || img}
                  alt="상품이미지"
                ></img>
              </div>
              <div className={styles.title}>
                <div>
                  {product.product_title.length > 20 ? `${product.product_title.slice(0, 20)}...` : product.product_title}
                </div>
                <div>{product.price.toLocaleString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div>베스트 상품이 없습니다.</div>
        )}

      </div>
      <ScrollTop />
    </div>
  );
};
