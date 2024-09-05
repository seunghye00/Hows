import styles from './Cart.module.css'
import {Button} from "../../../components/Button/Botton";

export const Cart = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Cart
      </div>
      <div className={styles.cartInfo}>
        <div className={styles.leftBox}>
          <p>선택된 상품(3)</p>
          <Button size={"s"}/>
          <Button size={"m"}/>
          <Button size={"l"}/>
          <button>주문하기</button>
        </div>
        <div className={styles.rightBox}>
          <p>상품 금액 : 150,000원</p>
          <p>금액 : 150,000원</p>
          <p>금액 : 150,000원</p>

        </div>
      </div>

    </div>
  );
}