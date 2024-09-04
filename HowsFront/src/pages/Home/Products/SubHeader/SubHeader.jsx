import { useNavigate } from 'react-router-dom';
import styles from './SubHeader.module.css'
import { Product } from '../Main/Product/Product';

export const SubHeader = () => {
    const navi = useNavigate();

    return (
        <div className={styles.container}>
            <ul className={styles.menu}>
                <li onClick={()=>{navi('/products')}}>쇼핑홈</li>
                <li onClick={()=>{navi('/products/category')}}>카테고리</li>
                <li onClick={()=>{navi('/products/best')}}>베스트</li>
            </ul>
        </div>
    );
}