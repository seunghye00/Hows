import styles from './Detail.module.css'
import { useParams } from 'react-router-dom'
import { DetailPage } from './DetailPage/DetailPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from '../../../../../config/config';
import { addCommas } from '../../../../../commons/commons';



export const Detail = () => {
    const {product_seq} = useParams();
    const [list, setList] = useState({});
    const [quantity, setQuantity] = useState(1); // 기본 수량을 1로 설정
    const [totalPrice, setTotalPrice] = useState(0);
    const [liked, setLiked] = useState(false); // 좋아요 상태 관리
    const [likeCount, setLikeCount] = useState(0); // 좋아요 개수 상태 관리

    
    useEffect(()=>{
        // 상품 상세 정보
        axios.get(`${host}/product/detail/${product_seq}`).then(resp=>{
            console.log(resp)
            setList(resp.data);
            setTotalPrice(resp.data.price); // 초기 가격 설정
        })

        // 좋아요 개수
        axios.get(`${host}/likes/count`, { params: { product_seq } })
            .then((resp) => {
                setLikeCount(resp.data); // 서버에서 받은 좋아요 개수 상태로 설정
            })
            .catch((error) => {
                console.error('좋아요 개수 불러오기 실패:', error);
            });

        // 사용자가 이미 좋아요를 눌렀는지 확인 (임시 test)
        axios.get(`${host}/likes/check`, { params: { product_seq, member_id: 'hahaha123' } })
            .then((resp) => {
                setLiked(resp.data); // 서버에서 받은 좋아요 상태
            }).catch((error) => {console.error('좋아요 상태 확인 실패', error);});
    },[product_seq])


    // 수량 증가
    const increaseQuantity = () => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + 1;
            setTotalPrice(newQuantity * list.price);
            return newQuantity;
        });
    }

    // 수량 감소
    const decreaseQuantity = () => {
        setQuantity(prevQuantity => {
            if (prevQuantity > 1) {
                const newQuantity = prevQuantity - 1;
                setTotalPrice(newQuantity * list.price);
                return newQuantity;
            }
            return prevQuantity;
        });
    }

    const resetPrice = () => {
        setQuantity(1); // 수량을 1로 초기화
        setTotalPrice(list.price); // 총 가격을 제품의 원래 가격으로 설정
    }



// 좋아요 버튼 클릭 시 호출되는 함수
const handleLikeClick = () => {
    if (!liked) {
        // 좋아요 추가 
        setLiked(true);
        setLikeCount(likeCount + 1); 

        axios.post(`${host}/likes/insert`, {
            product_seq: product_seq,
            member_id: 'hahaha123' // 임시 ID
        }).then(() => {
            setLiked(true); // 좋아요 상태를 true로 변경
        }).catch((error) => {
            console.error('좋아요 추가 실패:', error);
            setLiked(false);
            setLikeCount(likeCount - 1); // 실패 시 원래 값으로 복구
        });
    } else {
        // 좋아요 취소 
        setLiked(false);
        setLikeCount(likeCount - 1); 

        axios.delete(`${host}/likes/delete`, {
            data: {
                product_seq: product_seq,
                member_id: 'hahaha123' // 임시 ID
            }
        }).then(() => {
            setLiked(false); // 좋아요 상태를 false로 변경
        }).catch((error) => {
            console.error('좋아요 취소 실패:', error);
            setLiked(true);
            setLikeCount(likeCount + 1); // 실패 시 원래 값으로 복구
        });
    }
};


    return (
        <div className={styles.contailer}>
            <div className={styles.contents}>
                {/* <p>{product_seq}</p> */}
                <div className={styles.img}>
                    <img src={list.product_thumbnail} alt={list.product_title}></img>
                </div>
                <div className={styles.content}>
                    <div className={styles.product_title}>
                        <div>
                            {list.product_title}
                        </div>
                        <div>
                            <div>
                                장바구니 
                            </div>
                            <div onClick={handleLikeClick}>
                                <i className={`bx ${liked ? 'bxs-heart' : 'bx-heart'}`}></i> {/* 하트 상태에 따라 다르게 표시 */}
                                {likeCount} {/* 좋아요 개수 표시 */}
                            </div>
                        </div>
                    </div>
                    <div className={styles.product_contents}>
                        <div>{list.product_contents}</div>
                        <div>내용</div>
                        <div>내용</div>
                        <div>내용</div>
                    </div>
                    <div className={styles.buy}>
                        <div>
                            <div onClick={resetPrice}><i className="bx bx-x"></i></div>
                            <div>
                                <button onClick={decreaseQuantity}><i className="bx bx-minus"></i></button>
                                <span>{quantity}</span> {/* 현재 수량 표시 */}
                                <button onClick={increaseQuantity}><i className="bx bx-plus"></i></button>
                            </div>
                            <div>
                                {addCommas(totalPrice || 0)} 원
                            </div>
                        </div>
                        <div>
                            <div>
                                바로구매
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DetailPage/>
        </div>
    )
}