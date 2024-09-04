import { useNavigate } from 'react-router-dom';
import styles from './SubHeader.module.css'
import { Product } from '../Main/Product/Product';

export const SubHeader = () => {
    const navi = useNavigate();

    return (
        <div className={styles.container}>
            <ul className={styles.menu}>
                <li onClick={()=>{navi('product')}}>쇼핑홈</li>
                <li onClick={()=>{navi('category')}}>카테고리</li>
                <li onClick={()=>{navi('best')}}>베스트</li>
            </ul>
        </div>
    );
}