import { useParams } from 'react-router-dom'
import styles from './Detail.module.css'
import { DetailPage } from './DetailPage/DetailPage';
import img from './../../../../../assets/images/interior_9.jpg'



export const Detail = () => {
    const {product_seq} = useParams();
    return (
        <div className={styles.contailer}>
            <div className={styles.contents}>
                {/* <p>{product_seq}</p> */}
                <div className={styles.img}>
                    <img src={img}></img>
                </div>
                <div className={styles.content}>
                    <div className={styles.product_title}>
                        <div>
                            상품이름
                        </div>
                        <div>
                            <div>
                                장바구니
                            </div>
                            <div>
                                바로구매
                            </div>
                            <div>
                                <i className="bx bx-heart"></i>
                            </div>
                        </div>
                    </div>
                    <div className={styles.product_contents}>
                        <div>내용</div>
                        <div>내용</div>
                        <div>내용</div>
                        <div>내용</div>
                        <div>내용</div>
                        <div>내용</div>
                    </div>
                    <div>test</div>
                </div>
            </div>
            <DetailPage/>
        </div>
    )
}