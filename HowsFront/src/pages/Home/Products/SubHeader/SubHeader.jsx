import { useNavigate } from 'react-router-dom';
import styles from './SubHeader.module.css'
import { useState } from 'react';

export const SubHeader = () => {

    const navi = useNavigate();

    //로컬스토리지에서 activeMenu 값을 가져오거나 없으면 '쇼핑홈' 으로  초기화
    const [activeMenu, setActiveMenu] = useState('쇼핑홈')

    const handleMenuClick = menuName => {
        setActiveMenu(menuName);

        // 클릭할 때마다 로컬스토리지에 저장 
        // localStorage.setItem('activeMenu', menuName);

        if (menuName === '쇼핑홈') {
            navi('/products')
        } else if (menuName === '카테고리') {
            navi('/products/category')
        } else if (menuName === '베스트') {
            navi('/products/best')
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <ul className={styles.menu}>
                    <li
                      className={`${styles.naviMenu} ${activeMenu === '쇼핑홈' ? styles.active : ''}`}
                      onClick={() => handleMenuClick('쇼핑홈')}>쇼핑홈
                    </li>
                    <li
                      className={`${styles.naviMenu} ${activeMenu === '카테고리' ? styles.active : ''}`}
                      onClick={() => handleMenuClick('카테고리')}>카테고리
                    </li>
                    <li
                      className={`${styles.naviMenu} ${activeMenu === '베스트' ? styles.active : ''}`}
                      onClick={() => handleMenuClick('베스트')}>베스트
                    </li>
                </ul>
            </div>
        </div>
    );
}