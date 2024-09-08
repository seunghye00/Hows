import styles from './Best.module.css'
import img from '../../../../../assets/images/마이페이지_프로필사진.jpg'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop';

export const Best = () => {
  return (
    <div className={styles.container}>
        <div className={styles.bestTitlt}>베스트 상품</div>
        <div className={styles.contents}>
          <div className={styles.item}>
            <div className={styles.bookMark}>1</div>
            <div className={styles.img}>
              <img src={img} alt='상품이미지'></img>
            </div>
            <div className={styles.title}>
              <div>상품명</div>
              <div>상품가격</div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.bookMark}>2</div>
            <div className={styles.img}>
              <img src={img} alt='상품이미지'></img>
            </div>
            <div className={styles.title}>
              <div>상품명</div>
              <div>상품가격</div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.bookMark}>3</div>
            <div className={styles.img}>
              <img src={img} alt='상품이미지'></img>
            </div>
            <div className={styles.title}>
              <div>상품명</div>
              <div>상품가격</div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.bookMark}>4</div>
            <div className={styles.img}>
              <img src={img} alt='상품이미지'></img>
            </div>
            <div className={styles.title}>
              <div>상품명</div>
              <div>상품가격</div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.img}>
              <img src={img} alt='상품이미지'></img>
            </div>
            <div className={styles.title}>
              <div>상품명</div>
              <div>상품가격</div>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.img}>
              <img src={img} alt='상품이미지'></img>
            </div>
            <div className={styles.title}>
              <div>상품명</div>
              <div>상품가격</div>
            </div>
          </div>
        </div>
        <ScrollTop />
    </div>
  );
}