import { useParams } from 'react-router-dom'
import styles from './Detail.module.css'



export const Detail = () => {
    const {product_seq} = useParams();
    return (
        <div className={styles.contailer}>
            <p>{product_seq}</p>
        </div>
    )
}