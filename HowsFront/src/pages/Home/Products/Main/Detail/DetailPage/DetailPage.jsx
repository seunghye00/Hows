import { useEffect, useState } from 'react';
import styles from './DetailPage.module.css'
import img from '../../../../../../assets/images/마이페이지_프로필사진.jpg'
import StarRating from '../../../../../../components/StarRating/StarRating';
import { Modal } from '../../../../../../components/Modal/Modal';
import { api, host } from '../../../../../../config/config';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../../../../../store/store';
import axios from 'axios';
import Swal from "sweetalert2";

export const DetailPage = () => {
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const { product_seq } = useParams();
    const memberId = sessionStorage.getItem("member_id"); // 세션에서 member_id 가져오기


    // ===== 상태 =====
    const [data, setData] = useState({
        rating: 0,                  // 별점 상태
        review_contents: '',        // 리뷰 내용
        product_seq: product_seq,   // 상품 번호를 URL에서 가져온 현재 product_seq 로 설정
        image_url: '',              // 이미지 URL
    });
    
    const [activeTab, setActiveTab] = useState('info'); // 탭 메뉴
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달창
    const [ reviews,setReviews ] = useState([]); // 리뷰 목록
    const [averageRating, setAverageRating] = useState(0); // 평균 별점
    const [ratingsCount, setRatingsCount] = useState({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    }); // 각 점수에 몇 명이 있는지 저장하는 상태

    // ===== 상태 =====


    // 탭 메뉴  
    const handleTabChange = (tabName) => setActiveTab(tabName);

    // 모달창 열기 및 닫기
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    // 별점 변경 시 호출되는 함수
    const handleRatingChange = (newRating) => {
        setData((prevData) => ({
            ...prevData,
            rating: newRating, 
        }));
    };

    // 리뷰 내용 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 이미지 선택 핸들러
    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files) {
            // 파일 수를 4개로 제한
            if (files.length > 4) {
                Swal.fire({
                    icon: "warning",
                    title: "최대 4개의 파일만 선택할 수 있습니다.",
                    showConfirmButton: true,
                })
                handleCloseModal(); // 모달 창 닫기
                return ;
            }
    
            // 파일 목록을 상태로 저장
            setData(prevData => ({
                ...prevData,
                images: Array.from(files) // 파일 리스트를 배열로 변환
            }));
        }
    };
    
    // 모든 필드를 입력했는지 검사
    const isFormValid = () => {
        const { rating, review_contents, images } = data;
        return rating && review_contents && images && images.length > 0;
    };

    // 리뷰 등록
    const handleSubmit = () => {
        if (!isFormValid()) {
            alert('별점, 리뷰 내용, 그리고 이미지를 모두 입력해 주세요.');
            return;
        }

        const formData = new FormData();
    
        // 리뷰 데이터를 JSON 형식으로 변환하여 FormData에 추가함
        const reviewData = JSON.stringify({
            rating: data.rating,
            review_contents: data.review_contents,
            product_seq: data.product_seq,
            member_id: memberId 
        });
        formData.append('reviewData', reviewData);
    
        // 이미지 여러 파일 추가 
        if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
                formData.append('images', image); 
            });
        }

        data.images.forEach((_, index) =>
            formData.append('image_orders', index + 1)
        )
    
        // 서버로 전송
        api.post(`/product/reviewAdd`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {

            // console.log('성공', response.data);
            Swal.fire({
                icon: "warning",
                title: "리뷰 제출에 성공했습니다.",
                showConfirmButton: true,
            })
            handleCloseModal();
            return;

        }).catch((error) => {
            alert('리뷰 제출에 실패했습니다');
            handleCloseModal();
        });
    };



    // 리뷰 출력 및 별점 평균 계산
    useEffect(() => {
        console.log("Product Seq:" + product_seq);
        
        axios.get(`${host}/product/getReviewList/${product_seq}`).then(resp => {
            console.log("리뷰 데이터: ", resp.data);

            // 서버에서 데이터를 성공적으로 받아온 경우 처리
            if (resp.data && resp.data.reviewList && resp.data.reviewList.length > 0) {
                setReviews(resp.data.reviewList);

                // 리뷰의 RATING 값을 이용해 평균 별점 계산
                const totalRating = resp.data.reviewList.reduce((acc, review) => acc + review.RATING, 0);
                const average = totalRating / resp.data.reviewList.length;
                setAverageRating(average); // 평균 별점 상태로 저장

                // 각 별점(1~5)에 몇 명이 해당하는지 카운팅
                const newRatingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                resp.data.reviewList.forEach(review => {
                    const rating = review.RATING;
                    if (rating >= 1 && rating <= 5) {
                        newRatingsCount[rating]++; // 해당 별점에 해당하는 인원수 증가
                    }
                });
                setRatingsCount(newRatingsCount); // 각 점수별 인원수를 상태로 저장
            }
        })
        .catch(error => {
            console.error('리뷰 목록 오류', error);
        });
    }, [product_seq]); // product_seq가 변경될 때마다 실행

    
    


    return(
        <div className={styles.container}>
            <div className={styles.menu}>
                <button onClick={() => handleTabChange('info')}>상품정보</button>
                <button onClick={() => handleTabChange('reviews')}>리뷰</button>
                <button onClick={() => handleTabChange('details')}>배송/환불</button>
            </div>
            <div className={styles.content}>
                {activeTab === 'info' && (
                <div className={styles.info}>
                    {/* 상품 정보 내용 */}
                    <h2>상품 정보</h2>
                    <div>
                        여기는 상품 정보.
                    </div>
                </div>
                )}

                {activeTab === 'reviews' && (
                <div className={styles.reviews}>
                    {/* 상품 리뷰 내용 */}
                    <div className={styles.reviewsBox}>
                        <div className={styles.reviewsHeader}>
                            <div>리뷰 {reviews.length} </div>
                            
                            {isAuth ? (
                                // 로그인 상태일 때
                                <div onClick={handleOpenModal}>리뷰쓰기</div>
                            ) : (
                                // 로그인이 되어 있지 않을 때
                                <div>로그인 후 리뷰를 작성할 수 있습니다.</div>
                            )}

                            {/* 모달창 */}
                            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                                <div className={styles.modalBox}>
                                    <h2>리뷰 쓰기</h2>
                                    <div>
                                        <span>만족도 </span> &nbsp; &nbsp;
                                        <StarRating 
                                            rating={data.rating} // 현재 별점 상태 전달
                                            onRatingChange={handleRatingChange} // 별점 변경 시 호출
                                        />
                                    </div>

                                    <h2>리뷰 작성</h2>
                                    <div className={styles.reviewModal}>
                                        <input type='text' 
                                            name='review_contents' 
                                            placeholder='리뷰 내용을 입력하세요.' 
                                            value={data.review_contents} 
                                            onChange={handleInputChange}
                                            className={styles.reviewContent}>
                                        </input>

                                        {/* 이미지 업로드 */}
                                        <div className={styles.filesBox}>
                                            <label className={styles.fileBtn} for="files">
                                                <div>
                                                    <span> 사진 첨부하기 </span>
                                                    <i class='bx bxs-file-image'/>
                                                </div>
                                            </label>
                                            <input type="file" accept="image/*" id='files' className={styles.files} onChange={handleImageChange} multiple/>
                                        </div>
                                        <span className={styles.filesTitle}>첨부파일은 최대 4개까지만 가능합니다</span>

                                        <button onClick={handleSubmit}>리뷰 제출</button> 
                                    </div>
                                </div>
                            </Modal>

                        </div>
                        <div className={styles.reviewsStarRating}>
                            <div><StarRating rating={averageRating} />&nbsp;&nbsp;<span>{averageRating.toFixed(1)}</span></div>
                            <div>
                                <ul>
                                    <li>
                                        5점&nbsp;&nbsp;{ratingsCount[5]}명
                                    </li>
                                    <li>
                                        4점&nbsp;&nbsp;{ratingsCount[4]}명
                                    </li>
                                    <li>
                                        3점&nbsp;&nbsp;{ratingsCount[3]}명
                                    </li>
                                    <li>
                                        2점&nbsp;&nbsp;{ratingsCount[2]}명
                                    </li>
                                    <li>
                                        1점&nbsp;&nbsp;{ratingsCount[1]}명
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.reviewsMain}>
                            <div className={styles.option}>
                                <div>베스트순</div>
                                <div>최신순</div>
                            </div>
                            <div className={styles.reviewBox}>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <div key={review.REVIEW_SEQ || index}>
                                            <div>
                                                <div> <img src={img} alt='img'/> </div>
                                                <div>
                                                    <div>작성자 : {review.MEMBER_ID} </div>
                                                    <div><StarRating rating={review.RATING} /></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div> <img src={img} alt='img'/> </div>
                                                <div>
                                                    <div>{review.REVIEW_DATE ? review.REVIEW_DATE : '날짜 없음'}</div> 
                                                    <div>{review.REVIEW_CONTENTS}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>리뷰가 없습니다.</div> // 리뷰가 없을 때 처리
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {activeTab === 'details' && (
                <div className={styles.details}>
                    {/* 상품 질문 내용 */}
                    <div>
                        <h3>배송</h3>
                        <div>
                            <div className={styles.line}>
                                <div>배송</div>
                                <div>일반택배</div>
                            </div>
                            <div className={styles.line}>
                                <div>배송비</div>
                                <div>3,500원  <span>100,000원 이상 구매시 무료배송</span></div>
                            </div>
                            <div className={styles.line}>
                                <div>도서산간 추가 배송비</div>
                                <div>5,000원</div>
                            </div>
                            <div className={styles.line}>
                                <div>배송불가 지역</div>
                                <div>배송불가 지역이 없습니다.</div>
                            </div>
                        </div>
                        <h3>교환/환불</h3>
                        <div>
                            <div className={styles.line}>
                                <div>반품 배송비</div>
                                <div>3,500원  <span>최초 배송비가 무료인 경우 5,000원 부과</span></div>
                            </div>
                            <div className={styles.line}>
                                <div>교환 배송비</div>
                                <div>5,000원</div>
                            </div>
                            <div className={styles.line}>
                                <div>보내실 곳</div>
                                <div>서울 동대문구 한빛로 12 5층 505호</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4>반품/교환 사유에 따른 요청 가능 기간</h4>
                        <p>반품 시 먼저 판매자와 연락하셔서 반품사유, 택배사, 배송비, 반품지 주소 등을 협의하신 후 반품상품을 발송해 주시기 바랍니다.</p>
                        <ol>
                            <li>1. 구매자 단순 변심은 상품 수령 후 7일 이내  <span>구매자 반품배송비 부담</span></li>
                            <li>2. 표시/광고와 상이, 계약내용과 다르게 이행된 경우 상품 수령 후 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내. 둘 중 하나 경과 시 반품/교환 불가  <span>판매자 반품배송비 부담</span></li>
                        </ol>

                        <h4>반품/교환 불가능 사유</h4>
                        <p>아래와 같은 경우 반품/교환이 불가능합니다.</p>
                        <ol>
                            <li>1  반품요청기간이 지난 경우</li>
                            <li>2. 구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우  <span>단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외</span></li>
                            <li>3. 포장을 개봉하였으나 포장이 훼손되어 상품가치가 현저히 상실된 경우</li>
                            <li>4. 구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우</li>
                            <li>5. 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</li>
                            <li>6. 고객주문 확인 후 상품제작에 들어가는 주문제작상품</li>
                            <li>7. 복제가 가능한 상품 등의 포장을 훼손한 경우</li>
                        </ol>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.card_line}>
                            <div className={styles.label}>상호</div>
                            <div className={styles.value}>(주) 도비즈</div>
                        </div>
                        <div className={styles.card_line}>
                            <div className={styles.label}>대표자</div>
                            <div className={styles.value}>노시온</div>
                        </div>
                        <div className={styles.card_line}>
                            <div className={styles.label}>사업장소재지</div>
                            <div className={styles.value}>서울 동대문구 한빛로 12 5층 505호</div>
                        </div>
                        <div className={styles.card_line}>
                            <div className={styles.label}>고객센터 전화번호</div>
                            <div className={styles.value}>010-5122-4519</div>
                        </div>
                        <div className={styles.card_line}>
                            <div className={styles.label}>E-mail</div>
                            <div className={styles.value}>shaaa6256@gmail.com</div>
                        </div>
                        <div className={styles.card_line}>
                            <div className={styles.label}>사업자 등록번호</div>
                            <div className={styles.value}>2024-10-01</div>
                        </div>
                    </div>

                </div>
                )}
            </div>
        </div>
    )
}