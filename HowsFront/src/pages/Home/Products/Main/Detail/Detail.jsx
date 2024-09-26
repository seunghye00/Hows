import styles from './Detail.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { DetailPage } from './DetailPage/DetailPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { api, host } from '../../../../../config/config';
import { addCommas } from '../../../../../commons/commons';
import StarRating from '../../../../../components/StarRating/StarRating';
import { useAuthStore } from '../../../../../store/store';
import Swal from "sweetalert2";
import { useOrderStore } from '../../../../../store/orderStore';
import { checkLikeStatus, getReviewList , getProductDetail, getLikeCount, getRatings, addLike, removeLike} from '../../../../../api/product';



export const Detail = () => {
    const {product_seq} = useParams();
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const memberId = sessionStorage.getItem("member_id"); // 세션에서 member_id 가져오기
    const navi = useNavigate(); //페이지 전환을 위한 훅


    // ======================================== 상태 ========================================
    const [list, setList] = useState({}); // 상품 정보
    
    const [quantity, setQuantity] = useState(1); // 기본 수량을 1로 설정
    const [totalPrice, setTotalPrice] = useState(0); // 가격

    const [liked, setLiked] = useState(false); // 좋아요 상태 관리
    const [likeCount, setLikeCount] = useState(0); // 좋아요 개수 상태 관리

    const [averageRating, setAverageRating] = useState(0); // 평균 별점 상태 추가

    const { setOrderProducts, setOrderPrice } = useOrderStore(); // 구매 관련
    
    const [ ratingsCount, setRatingsCount ] = useState({5: 0,4: 0,3: 0,2: 0,1: 0}); // 별점 평균
    // ======================================== 상태 ========================================


    useEffect(()=>{
        window.scrollTo(0, 0); 

        // 상품 상세 정보
        getProductDetail(product_seq).then(resp=>{
            setList(resp.data);
            setTotalPrice(resp.data.price); // 초기 가격 설정
        });

        // 좋아요 개수
        getLikeCount(product_seq).then(resp => {setLikeCount(resp.data);});

        // 좋아요 상태
        checkLikeStatus(product_seq, memberId).then(resp => setLiked(resp.data));

        // 별점 데이터 받아서 평균 계산
        getRatings(product_seq).then(resp => {
            const ratings = resp.data;
            // 모든 리뷰의 별점을 더하고, 리뷰 수로 나누어 평균 별점 계산
            const avgRating = ratings.reduce((acc, review) => acc + review.rating, 0) / ratings.length;
            setAverageRating(avgRating); // 평균 별점 상태 업데이트
        });
        
    },[])


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

        if(!isAuth) {
            Swal.fire({
                icon: "warning",
                title: "로그인을 먼저 해주세요.",
                showConfirmButton: true,
            }).then(()=>{ navi('/signIn') }) //로그인이 안된 경우 로그인 페이지로 이동
            return ;
        }else{
            if (!liked) {
                // 좋아요 추가 
                setLiked(true);
                setLikeCount(likeCount + 1); 
    
                addLike(product_seq, memberId)
                    .then(() => { setLiked(true);})
                    .catch((error) => {
                        console.error('좋아요 추가 실패:', error);
                        setLiked(false);
                        setLikeCount(likeCount - 1); // 실패 시 원래 값으로 복구
                    });
            } else {
                // 좋아요 취소 
                setLiked(false);
                setLikeCount(likeCount - 1); 
    
                removeLike(product_seq,memberId)
                    .then(() => { setLiked(false); 
                    }).catch((error) => {
                        console.error('좋아요 취소 실패:', error);
                        setLiked(true);
                        setLikeCount(likeCount + 1); // 실패 시 원래 값으로 복구
                    });
            }

        }
    };
    
    // 구매하기 버튼 클릭 시 호출되는 함수
    const handleGet = () => {
        if (!memberId || !isAuth) {
            Swal.fire({
                icon: "warning",
                title: "로그인을 먼저 해주세요.",
                showConfirmButton: true,
            }).then(() => { navi('/signIn');}); // 로그인이 안된 경우 로그인 페이지로 이동
            return;
        }

        // 상품 정보 확인
        if (!quantity || !totalPrice) {
            Swal.fire({
                icon: "error",
                title: "상품 정보를 불러오는 중 오류가 발생했습니다.",
                text: "다시 시도해 주세요.",
            });
            return;
        }

        let order = [];
        let orderPrice = 0;
            
        // 상품 정보 설정
        const data = {
            product_seq: product_seq,
            product_title: list.product_title,
            product_image: list.product_thumbnail,
            product_quantity: quantity, 
            product_total_price: totalPrice, 
        }

        // 주문 가격 계산
        orderPrice += totalPrice;
        order.push(data);

        setOrderPrice(orderPrice);
        setOrderProducts(order);

        // 세션에 저장
        sessionStorage.setItem("howsOrder", JSON.stringify(order));
        sessionStorage.setItem("howsPrice", orderPrice);

        navi("/payment"); // 결제 페이지로 이동
    };

    // 장바구니 버튼 클릭 시 호출되는 함수
    const handleCart = () => {

        if (!memberId || !isAuth) {
            Swal.fire({
                icon: "warning",
                title: "로그인을 먼저 해주세요.",
                showConfirmButton: true,
            }).then(()=>{ navi('/signIn') }) // 로그인 페이지로 이동
            return ;
        }

        const data = {
            product_seq:product_seq,
            product_title:list.product_title,
            product_image:list.product_thumbnail,
            cart_quantity:quantity,
            cart_price:totalPrice,
        }

        api.post(`/cart`,data).then(resp=>{
            // 수량 및 가격 초기화
            setQuantity(1);
            setTotalPrice(list.price);

            Swal.fire({
                icon: 'success',
                title: '장바구니 등록 성공!',
            })            
        }).catch(errer =>{
            Swal.fire({
                icon: 'errer',
                title: '장바구니 등록 실패!',
            })
        })

    }

    return (
        <div className={styles.contailer}>
            <div style={{height: "70px"}}></div>
            <div className={styles.contents}>
                <div className={styles.img}>
                    <img src={list.product_thumbnail} alt={list.product_title}></img>
                </div>
                <div className={styles.content}>
                    <div className={styles.product_title}>
                        <div>
                            {list.product_title}
                        </div>
                        <div onClick={handleLikeClick}>
                            {likeCount} {/* 좋아요 개수 */}
                            <i className={`bx ${liked ? 'bx bx-home-heart' : 'bx bx-home-alt-2'}`}></i> {/* 하트 상태에 따라 다르게 표시 */}
                        </div>
                    </div>
                    <div className={styles.product_contents}>
                        <div>{addCommas(list.price || 0)}&nbsp;원</div>
                        <div>
                            <StarRating rating={averageRating || 0} /> {/* 상품 별점 표시 */}
                        </div>
                        <div>배송</div>
                        <div>3,000원 &nbsp;&nbsp; <span>5만원 이상 무료배송</span></div>
                    </div>
                    <div className={styles.buy}>
                        <div>
                            <div onClick={resetPrice}><i className="bx bx-x"></i></div>
                            <div>
                                <button onClick={decreaseQuantity}><i className="bx bx-minus"></i></button>
                                <span>{quantity}</span> 
                                <button onClick={increaseQuantity}><i className="bx bx-plus"></i></button>
                            </div>
                            <div>
                                {addCommas(totalPrice || 0)} 원
                            </div>
                        </div>
                        <div>
                            <div onClick={handleCart}>장바구니</div>
                            <div onClick={handleGet}>바로구매</div>
                        </div>
                    </div>
                </div>
            </div>
            <DetailPage/>
        </div>
    )
}