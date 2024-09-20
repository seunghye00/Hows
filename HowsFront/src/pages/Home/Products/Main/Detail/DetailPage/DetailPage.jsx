import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DetailPage.module.css'
import { useAuthStore } from '../../../../../../store/store';
// API 함수 불러오기
import { getProductDetail } from '../../../../../../api/product';
import { DeliveryInfo } from '../DeliveryInfo/DeliveryInfo';
import { ReviewSection } from '../ReviewSection/ReviewSection';
import { ScrollTop } from '../../../../../../components/ScrollTop/ScrollTop';



export const DetailPage = () => {
    const { product_seq } = useParams(); 
    const { isAuth } = useAuthStore() // 로그인 여부 확인

    // 탭 상태 및 상품 정보
    const [ activeTab, setActiveTab ] = useState('info'); // 탭 메뉴
    const [ productContents, setProductContents ] = useState(''); // 상품 정보
    // 탭 변경 함수
    const handleTabChange = (tabName) => setActiveTab(tabName);

    useEffect(()=>{
        // 상품 설명 불러오기
        getProductDetail(product_seq)
            .then(resp=>{setProductContents(resp.data.product_contents);})
            .catch((error) => {console.error('상품 설명 불러오기 오류', error);});
    },[])

    return(
        <div className={styles.container}>
            <div className={styles.menu}>
                <button onClick={() => handleTabChange('info')}>상품정보</button>
                <button onClick={() => handleTabChange('reviews')}>리뷰</button>
                <button onClick={() => handleTabChange('deliveryInfo')}>배송/환불</button>
            </div>
            <div className={styles.content}>
                {activeTab === 'info' && (
                    <div className={styles.info}>
                        <img src={productContents} alt={productContents}></img>
                    </div>
                )}
                {activeTab === 'reviews' && (<ReviewSection product_seq={product_seq} isAuth={isAuth}/>)}

                {activeTab === 'deliveryInfo' && <DeliveryInfo/>}
            </div>
            <ScrollTop />
        </div>
    )
}