import styles from './Cart.module.css'
import img1 from '../../../assets/images/interior_1.jpg'
import img2 from '../../../assets/images/interior_2.jpg'
import img3 from '../../../assets/images/interior_3.jpg'
import img4 from '../../../assets/images/interior_4.jpg'
import img5 from '../../../assets/images/interior_5.jpg'
import img6 from '../../../assets/images/interior_6.jpg'
import img7 from '../../../assets/images/interior_7.jpg'

export const Cart = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Cart
      </div>
      <div className={styles.cartInfo}>
        <div className={styles.leftBox}>
          <p>선택된 상품 (3)</p>
          <button>주문하기</button>
        </div>
        <div className={styles.rightBox}>
          <div>
            <p>상품 금액 : </p>
            <p>배송비 : </p>
            <p>주문 금액 : </p>
          </div>
          <div>
            <p>150,000원</p>
            <p>3,000원</p>
            <p>153,000원</p>
          </div>

        </div>
      </div>
      <div className={styles.itemForm}>
        <div className={styles.btnBox}>
          <input type="checkbox"/>
          <button>선택 삭제</button>
        </div>
        <div className={styles.items}>

          <div className={styles.item}>
            <input type="checkbox"/>
            <div className={styles.itemImage}>
              <img src={img1} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span> 수량 : </span>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div className={styles.itemPrice}>
              <p>78,000원</p>
              <button>구입</button>
              <button>삭제</button>
            </div>
          </div>

          <div className={styles.item}>
            <input type="checkbox"/>
            <div className={styles.itemImage}>
              <img src={img2} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span> 수량 : </span>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div className={styles.itemPrice}>
              <p>78,000원</p>
              <button>구입</button>
              <button>삭제</button>
            </div>
          </div>

          <div className={styles.item}>
            <input type="checkbox"/>
            <div className={styles.itemImage}>
              <img src={img3} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span> 수량 : </span>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div className={styles.itemPrice}>
              <p>78,000원</p>
              <button>구입</button>
              <button>삭제</button>
            </div>
          </div>
          <div className={styles.item}>
            <input type="checkbox"/>
            <div className={styles.itemImage}>
              <img src={img4} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span> 수량 : </span>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div className={styles.itemPrice}>
              <p>78,000원</p>
              <button>구입</button>
              <button>삭제</button>
            </div>
          </div>

          <div className={styles.item}>
            <input type="checkbox"/>
            <div className={styles.itemImage}>
              <img src={img5} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span> 수량 : </span>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div className={styles.itemPrice}>
              <p>78,000원</p>
              <button>구입</button>
              <button>삭제</button>
            </div>
          </div>

          <div className={styles.item}>
            <input type="checkbox"/>
            <div className={styles.itemImage}>
              <img src={img6} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span> 수량 : </span>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div className={styles.itemPrice}>
              <p>78,000원</p>
              <button>구입</button>
              <button>삭제</button>
            </div>
          </div>
          <div className={styles.item}>
            <input type="checkbox"/>
            <div className={styles.itemImage}>
              <img src={img7} alt="상품이미지"/>
            </div>
            <div className={styles.itemInfo}>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit....</p>
              <div className={styles.itemCount}>
                <span> 수량 : </span>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div className={styles.itemPrice}>
              <p>78,000원</p>
              <button>구입</button>
              <button>삭제</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}