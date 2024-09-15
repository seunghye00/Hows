import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DetailPage.module.css'
import axios from 'axios';
import Swal from "sweetalert2";
import img from '../../../../../../assets/images/마이페이지_프로필사진.jpg'
import StarRating from '../../../../../../components/StarRating/StarRating';
import { Modal } from '../../../../../../components/Modal/Modal';
import { api, host } from '../../../../../../config/config';
import { useAuthStore } from '../../../../../../store/store';
import { formatDate } from '../../../../../../commons/commons'
import { Paging } from '../../../../../../components/Pagination/Paging';
// API 함수 불러오기
import { userInfo } from '../../../../../../api/member' 
import { getReviewList , getProductDetail,getReviewImgList } from '../../../../../../api/product';



export const DetailPage = () => {
    const { product_seq } = useParams(); 
    const { isAuth } = useAuthStore() // 로그인 여부 확인
    const memberId = sessionStorage.getItem("member_id"); // 세션에서 member_id 가져오기
    
    // ======================================== 상태 ========================================
    const [data, setData] = useState({
        rating: 0,                  // 별점 상태
        review_contents: '',        // 리뷰 내용
        product_seq: product_seq,   // 상품 번호를 URL에서 가져온 현재 product_seq 로 설정
        image_url: [],              // 이미지 URL
    });
    const [ activeTab, setActiveTab ] = useState('info'); // 탭 메뉴
    const [ isModalOpen, setIsModalOpen ] = useState(false); // 모달창

    const [ page, setPage ] = useState(1) // 페이지네이션, 현재 페이지
    const [ itemsPerPage ] = useState(10)  // 페이지네이션, 페이지당 항목 수
    const [ totalReviews, setTotalReviews ] = useState(0) // 페이지네이션, 전체 리뷰 개수 

    const [ reviews,setReviews ] = useState([]); // 리뷰 목록
    const [ averageRating, setAverageRating ] = useState(0); // 평균 별점
    const [ ratingsCount, setRatingsCount ] = useState({5: 0,4: 0,3: 0,2: 0,1: 0});

    const [ isSubmitting, setIsSubmitting ] = useState(false); // 제출 중 여부
    const [ productContents, setProductContents ] = useState(''); // 상품 정보
    const [ previewImages, setPreviewImages ] = useState([]); // 이미지 미리보기 URL을 저장

    const [reviewAvatars, setReviewAvatars] = useState({}); // 각 리뷰 작성자의 프로필 이미지를 저장
    // ======================================== 상태 ======================================== 


    // 탭 메뉴  
    const handleTabChange = (tabName) => setActiveTab(tabName);

    // 모달창 열기 및 닫기 (상태 초기화 작업)
    const handleOpenModal = () => {
        setData({rating: 0, review_contents: '', product_seq:product_seq, images: []});
        setPreviewImages([]);  
        setIsModalOpen(true); 
    };
    const handleCloseModal = () => setIsModalOpen(false);

    // 별점 변경 시 호출되는 함수
    const handleRatingChange = (newRating) => {
        setData((prevData) => ({
            ...prevData,
            rating: newRating, 
        }));
    };

    // 리뷰 내용 변경 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // [리뷰 작성] 이미지 선택
    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files) {
            // 파일 수가 4개를 초과하면 경고 메시지 표시
            if (files.length > 4 || (data.images && data.images.length + files.length > 4)) {
                Swal.fire({
                    icon: "warning",
                    title: "최대 4개의 파일만 선택할 수 있습니다.",
                    showConfirmButton: true,
                });
                return;
            }
    
            // 새로 선택한 파일들을 URL로 변환하여 미리보기 배열에 추가
            const newPreviewImages = Array.from(files).map(file => URL.createObjectURL(file));

            // 기존 이미지들과 새로 선택한 이미지를 병합하여 상태 업데이트
            setPreviewImages((prevImages) => [...prevImages, ...newPreviewImages]);

            // 기존 이미지들과 새로 선택한 이미지를 병합하여 상태에 저장
            setData(prevData => ({
                ...prevData, // 기존 데이터는 유지하고
                images: [...(prevData.images || []), ...Array.from(files)] // 이미지 배열 업데이트
            }));
        }
    };

    // [리뷰 작성] 이미지 제거 
    const handleRemoveImage = (index) => {

        // 이미지 URL을 미리보기 배열에서 제거
        setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
    
        // 이미지 파일을 data.images에서 제거
        setData((prevData) => ({
            ...prevData, // 기존의 데이터는 유지하고
            images: prevData.images.filter((_, i) => i !== index) // 선택된 이미지만 삭제
        }));
    };
    // 선택한 이미지들을 미리보기에 표시하는 함수 (배열에 저장된 이미지 URL을 기반으로 렌더링)
    const renderPreviewImages = () => {
        return previewImages.map((src, index) => (
            <div key={index} className={styles.previewImageContainer}>
                {/* 이미지 미리보기 */}
                <img src={src} alt={`preview ${index}`} className={styles.previewImage} />

                {/* 이미지 삭제 버튼: 클릭 시 handleRemoveImage 함수 호출 */}
                <button 
                    className={styles.deleteButton} 
                    onClick={() => handleRemoveImage(index)} // 이미지 제거 함수 호출
                >
                    X
                </button>
            </div>
        ));
    };
    
    
    // 모든 필드를 입력했는지 검사
    const isFormValid = () => {
        const { rating, review_contents, images } = data;
        return rating && review_contents && images && images.length > 0;
    };

    // 리뷰 등록 함수 
    const handleSubmit = () => {
        if (isSubmitting) return;
    
        setIsSubmitting(true);
    
        if (!isFormValid()) {
            alert('별점, 리뷰 내용, 그리고 이미지를 모두 입력해 주세요.');
            setIsSubmitting(false);
            return;
        }
    
        const formData = new FormData();
    
        const reviewData = JSON.stringify({
            rating: data.rating,
            review_contents: data.review_contents,
            product_seq: data.product_seq,
            member_id: memberId 
        });
        formData.append('reviewData', reviewData);
    
        if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
                formData.append('images', image); 
            });
        }
    
        data.images.forEach((_, index) =>
            formData.append('image_orders', index + 1)
        )
    
        api.post(`/product/reviewAdd`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {
            Swal.fire({
                icon: "success",
                title: "리뷰 제출에 성공했습니다.",
                showConfirmButton: true,
            });
    
            // 리뷰 등록 성공 시, 새 리뷰를 추가하여 리뷰 목록을 업데이트
            const newReview = {
                RATING: data.rating,
                REVIEW_CONTENTS: data.review_contents,
                MEMBER_ID: memberId,
                REVIEW_DATE: new Date(), // 현재 시간을 등록 시간으로 사용
                images: previewImages.map((src, index) => ({ IMAGE_URL: src })), // 이미지 미리보기 배열을 사용하여 새 리뷰 이미지로 추가
            };
            
            setReviews((prevReviews) => [newReview, ...prevReviews]); // 새 리뷰를 목록에 추가
            setTotalReviews(prevCount => prevCount + 1); // 전체 리뷰 수 업데이트
            setIsModalOpen(false); // 모달 닫기
            setIsSubmitting(false); // 제출 상태 해제
        }).catch((error) => {
            alert('리뷰 제출에 실패했습니다');
            setIsModalOpen(false);
            setIsSubmitting(false);
        });
    };
    
    

    // 리뷰 이미지 로딩 함수
    const loadReviewImages = async (reviewSeq) => {
        try {
            const response = await getReviewImgList(reviewSeq);
            return response.data.reviewImgs || [];
        } catch (error) {
            console.error('리뷰 이미지 불러오기 오류', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const resp = await getReviewList(product_seq, page, itemsPerPage);
                const reviewsData = resp.data.reviews;
    
                if (reviewsData.length > 0) {
                    // 각 리뷰에 이미지 데이터를 병합
                    const reviewsWithImages = await Promise.all(
                        // 각 리뷰에 연결된 이미지 배열 추가 
                        reviewsData.map(async (review) => {
                            const images = await loadReviewImages(review.REVIEW_SEQ);
                            return { ...review, images };
                        })
                    );
    
                    // 리뷰 작성자 프로필 이미지를 불러오는 부분
                    const avatarPromises = reviewsData.map(async (review) => {
                        // member_id가 null 또는 "null"이 아닌 경우에만 호출
                        if (review.MEMBER_ID && review.MEMBER_ID !== "null") { 
                            try {
                                // 프로필 이미지 API 호출
                                const profileResp = await userInfo(review.MEMBER_ID);
                                return { memberId: review.MEMBER_ID, avatar: profileResp.data.member_avatar };
                            } catch (error) {
                                console.error(`프로필 이미지를 불러오는 중 오류 발생: ${review.MEMBER_ID}`, error);
                                return { memberId: review.MEMBER_ID, avatar: img }; // 오류 발생 시 기본 이미지
                            }
                        } else {
                            return { memberId: review.MEMBER_ID, avatar: img };  // member_id가 없으면 기본 이미지 반환
                        }
                    });

                    const avatarData = await Promise.all(avatarPromises);

    
                    // 프로필 이미지를 상태로 저장
                    const avatarsMap = avatarData.reduce((acc, { memberId, avatar }) => {
                        // memberId를 키로, avatar(프로필 이미지)를 값으로 저장
                        acc[memberId] = avatar; 
                        return acc;
                    }, {});
    
                    // 프로필 이미지를 상태로 저장
                    setReviewAvatars(avatarsMap); 

                    // 리뷰 상태 및 총 리뷰 수 설정
                    setReviews(reviewsWithImages);
                    setTotalReviews(reviewsData[0].TOTAL_COUNT);
    
                    // 평균 별점 계산
                    const totalRating = reviewsData.reduce((acc, review) => acc + review.RATING, 0);
                    setAverageRating(totalRating / reviewsData.length);
    
                    // 별점 카운트 업데이트
                    const newRatingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                    reviewsData.forEach(review => newRatingsCount[review.RATING]++);
                    setRatingsCount(newRatingsCount);
                }else {
                    setReviews([]);
                    setTotalReviews(0);
                    setAverageRating(0);
                    setRatingsCount({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
                }
            } catch (error) {
                console.error('리뷰 목록 불러오기 오류', error);
            }
        };
    
        fetchReviews();
    }, [product_seq, page, itemsPerPage]);
    
    // 페이지네이션
    const handlePageChange = (newPage) => {
        const startRow = (newPage - 1) * itemsPerPage + 1;
        const endRow = newPage * itemsPerPage;
        getReviewList(product_seq, startRow, endRow)
        .then(response => {
            setReviews(response.data.reviews);
            setTotalReviews(response.data.total_count);
        })
        .catch(error => {
            console.error('리뷰 목록 오류', error);
        });

    setPage(newPage);  // 페이지 상태 업데이트
    }


    // 리뷰 삭제 함수
    const handleReviewDel = (review_seq) => {
        axios.delete(`${host}/product/delReview/${review_seq}`)
            .then(response => {
                console.log('리뷰 삭제 성공:', response.data);
                // 삭제된 리뷰를 제외하고 나머지 리뷰로 상태 업데이트
                setReviews(prevReviews => prevReviews.filter(review => review.REVIEW_SEQ !== review_seq));
                Swal.fire({
                    icon: "success",
                    title: "리뷰가 성공적으로 삭제되었습니다.",
                    showConfirmButton: true,
                });
            })
            .catch(error => {
                console.error('리뷰 삭제 실패:', error);
                Swal.fire({
                    icon: "error",
                    title: "리뷰 삭제에 실패했습니다.",
                    showConfirmButton: true,
                });
            });
    };

    //리뷰 수정 함수
    const handleModify = () => {

    }

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
                <button onClick={() => handleTabChange('details')}>배송/환불</button>
            </div>
            <div className={styles.content}>
                {activeTab === 'info' && (
                    <div className={styles.info}>
                        <h2>상품 정보</h2>
                        <div>{productContents}</div>
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
                                            {/* 이미지 미리보기 */}
                                            <div className={styles.previewContainer}>
                                                {renderPreviewImages()}
                                            </div>
                                            <button onClick={handleSubmit} disabled={isSubmitting}>
                                                {/* disabled -> 폼 요소를 비활성화 */}
                                                {isSubmitting ? '제출 중...' : '리뷰 제출'}
                                            </button> 
                                        </div>
                                    </div>
                                </Modal>

                            </div>
                            <div className={styles.reviewsStarRating}>
                                <div><StarRating rating={averageRating} />&nbsp;&nbsp;<span>{averageRating.toFixed(1)}</span></div>
                                <div>
                                    <ul>
                                        <li>5점&nbsp;&nbsp;{ratingsCount[5]}명</li>
                                        <li>4점&nbsp;&nbsp;{ratingsCount[4]}명</li>
                                        <li>3점&nbsp;&nbsp;{ratingsCount[3]}명</li>
                                        <li>2점&nbsp;&nbsp;{ratingsCount[2]}명</li>
                                        <li>1점&nbsp;&nbsp;{ratingsCount[1]}명</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.reviewsMain}>
                                <div className={styles.option}>
                                    <div>베스트순</div>
                                    <div>최신순</div>
                                </div>
                                <div className={styles.reviewBox}>
                                    {console.log(reviews)}
                                    {reviews.length > 0 ? (
                                        (reviews || []).map((review, index) => (
                                            <div key={index}>
                                                <div>
                                                    <div>
                                                        <div>
                                                            {/* 리뷰 작성자의 프로필 이미지가 있으면 표시, 없으면 기본 이미지 표시 */}
                                                            <img src={reviewAvatars[review.MEMBER_ID] || img} alt="profile"/>
                                                        </div>
                                                        <div>
                                                            <div>{review.MEMBER_ID} </div>
                                                            <div><StarRating rating={review.RATING} /></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {/* 세션 memberId와 review.MEMBER_ID가 같을 때만 수정/삭제 버튼을 보여줌 */}
                                                        {memberId === review.MEMBER_ID && (
                                                            <>
                                                                <button onClick={handleModify}>수정</button>
                                                                <button onClick={()=>{handleReviewDel(review.REVIEW_SEQ);}}>삭제</button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>
                                                    {(review.images || []).length > 0 ? (
                                                        review.images.map((img, imgIndex) => (
                                                            <div key={imgIndex}><img src={img.IMAGE_URL} alt='img'/></div>
                                                        ))
                                                    ) : (
                                                        <div>이미지가 없습니다.</div> 
                                                    )}
                                                    </div>
                                                    <div>
                                                        <div>{review.REVIEW_DATE ? formatDate(review.REVIEW_DATE) : '날짜 없음'}</div> 
                                                        <div>{review.REVIEW_CONTENTS}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>리뷰가 없습니다.</div> 
                                    )}
                                </div>
                                <div>
                                    <Paging
                                        page={page}
                                        count={totalReviews} // 전체 리뷰 수
                                        perpage={itemsPerPage} // 페이지당 항목 수
                                        setPage={handlePageChange} 
                                    />
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