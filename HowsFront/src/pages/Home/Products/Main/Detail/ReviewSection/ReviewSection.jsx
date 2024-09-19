import { useEffect, useRef, useState } from 'react';
import styles from './ReviewSection.module.css'
import axios from 'axios';
import Swal from "sweetalert2";
import img from '../../../../../../assets/images/마이페이지_프로필사진.jpg'
import StarRating from '../../../../../../components/StarRating/StarRating';
import { Modal } from '../../../../../../components/Modal/Modal';
import { api, host } from '../../../../../../config/config';
import { formatDate } from '../../../../../../commons/commons'
import { Paging } from '../../../../../../components/Pagination/Paging';
import { userInfo } from '../../../../../../api/member' 
import { getReviewList , getReviewImgList , reviewLike, reviewUnlike , getReviewLikeCount , checkReviewLikeStatus , getRatings} from '../../../../../../api/product';
import ReportModal from '../ReportModal/ReportModal';
import { useNavigate } from 'react-router-dom';



export const ReviewSection = ({ product_seq, isAuth }) => {
    const memberId = sessionStorage.getItem("member_id"); // 세션에서 member_id 가져오기
    const navi = useNavigate(); //페이지 전환을 위한 훅
    
    // =============== 모달창 ===============
    const [ isReviewModalOpen, setIsReviewModalOpen ] = useState(false); // 리뷰
    const [ isReportModalOpen, setIsReportModalOpen ] = useState(false); // 신고 
    const [ selectedReviewSeq, setSelectedReviewSeq ] = useState(null); // 신고 모달에서 사용할 리뷰 seq

    // 리뷰 작성 모달 열기
    const handleOpenReviewModal = () => {
        setReviewMod({
            'state': false,
            'review_seq': 0
        });

        setIsReportModalOpen(false); // 신고 모달을 닫기
        setData({rating: 0, review_contents: '', product_seq:product_seq, images: []});
        setPreviewImages([]);
        setExistImages([]);
        setNewImages([]);
        setIsReviewModalOpen(true); 
    };

    // 리뷰 수정 모달 열기
    const handleOpenReviewModifyModal = (review) => {
        setReviewMod({
            'state': true,
            'review_seq': review.REVIEW_SEQ
        });

        setIsReportModalOpen(false); // 신고 모달을 닫기
        setPreviewImages([]);
        setExistImages([]);
        setNewImages([]);
        review.images.map((img) => {
            setExistImages((prevImages) => [...prevImages, img.IMAGE_URL])
        });
        setData({rating: review.RATING, review_contents: review.REVIEW_CONTENTS, product_seq:product_seq, images: review.images});
        setIsReviewModalOpen(true); 
    };

    // 신고 모달 열기
    const handleOpenReportModal = (reviewSeq) => {
        if (!isAuth) {
            // 로그인하지 않은 경우 경고 메시지 표시 후 로그인 페이지로 이동
            Swal.fire({
                icon: 'warning',
                title: '로그인을 먼저 해주세요.',
                showConfirmButton: true,
            }).then(() => {
                navi('/signIn'); // 로그인 페이지로 이동
            });
            return; // 로그인 안 되어 있으면 여기서 종료
        }

        setIsReviewModalOpen(false); // 리뷰 모달을 닫기
        setSelectedReviewSeq(reviewSeq); // 신고하려는 리뷰 seq 저장
        setIsReportModalOpen(true); // 신고 모달 열기
    };

    // 모달 닫기
    const handleCloseReviewModal = () => setIsReviewModalOpen(false);
    const handleCloseReportModal = () => setIsReportModalOpen(false);
    // =============== 모달창 ===============



    // 별점 상태, 리뷰 내용, 상품 번호를 URL에서 가져온 현재 product_seq 로 설정, 이미지 URL
    const [data, setData] = useState({rating: 0, review_contents: '', product_seq: product_seq, image_url: [],});
    
    // 리뷰 목록
    const [ reviews, setReviews ] = useState([]); // 리뷰 목록

    // 페이지네이션
    const [ page, setPage ] = useState(1) // 현재 페이지
    const [ itemsPerPage ] = useState(10)  // 페이지당 항목 수
    const [ totalReviews, setTotalReviews ] = useState(0) // 전체 리뷰 개수 

    // 평균 별점
    const [ averageRating, setAverageRating ] = useState(0);
    const [ ratingsCount, setRatingsCount ] = useState({5: 0,4: 0,3: 0,2: 0,1: 0});

    // 제출 중 여부
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    // 이미지 미리보기 URL을 저장 
    const [ existImages, setExistImages ] = useState([]); // 기존의 리뷰에서 사용 중인 이미지
    const [ newImages, setNewImages ] = useState([]); // 사용자가 새로 추가하는 이미지
    const [ previewImages, setPreviewImages ] = useState([]);
    
    // 각 리뷰 작성자의 프로필 이미지를 저장
    const [reviewAvatars, setReviewAvatars] = useState({});

    // 좋아요 상태 관리
    const [liked, setLiked] = useState({});
    const [likeCount, setLikeCount] = useState({});

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
            setNewImages((prevImages) => [...prevImages, ...newPreviewImages]);

            // 기존 이미지들과 새로 선택한 이미지를 병합하여 상태에 저장
            setData((prevData) => ({
                ...prevData, // 기존 데이터는 유지하고
                images: [...Array.from(files)] // 이미지 배열 업데이트
            }));
        }
    };

    // [리뷰 작성] 이미지 제거 
    const handleRemoveExistImage = (index) => {
        // 이미지 URL을 미리보기 배열에서 제거
        setExistImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index) => {
        // 이미지 URL을 미리보기 배열에서 제거
        setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));

        // 이미지 파일을 data.images에서 제거
        setData((prevData) => ({
            ...prevData, // 기존의 데이터는 유지하고
            images: prevData.images.filter((_, i) => i !== index) // 선택된 이미지만 삭제
        }));
    };

    // 선택한 이미지들을 미리보기에 표시하는 함수 (배열에 저장된 이미지 URL을 기반으로 렌더링)
    const renderPreviewImages = () => {
        return (
            <>
            {
                existImages.map((src, index) => (
                    <div key={index} className={styles.previewImageContainer}>
                        {/* 이미지 미리보기 */}
                        <img src={src} alt={`preview ${index}`} className={styles.previewImage} />

                        {/* 이미지 삭제 버튼: 클릭 시 handleRemoveImage 함수 호출 */}
                        <button 
                            className={styles.deleteButton} 
                            onClick={() => handleRemoveExistImage(index)} // 이미지 제거 함수 호출
                        >
                            X
                        </button>
                    </div>
                ))
            }

            {
                newImages.map((src, index) => (
                    <div key={index} className={styles.previewImageContainer}>
                        {/* 이미지 미리보기 */}
                        <img src={src} alt={`preview ${index}`} className={styles.previewImage} />

                        {/* 이미지 삭제 버튼: 클릭 시 handleRemoveImage 함수 호출 */}
                        <button  
                            className={styles.deleteButton} 
                            onClick={() => handleRemoveNewImage(index)} // 이미지 제거 함수 호출
                        >
                            X
                        </button>
                    </div>
                ))
            }
            </>
        )
    };
    
    // 모든 필드를 입력했는지 검사
    const isFormValid = () => {
        // return rating && review_contents && images && ((data.images.length + existImages.length) > 0);


        const { rating, review_contents, images } = data;

        if (!rating || !review_contents) {
            return false;
        }
    
        if ((!newImages || newImages.length === 0) && (!existImages || existImages.length === 0)) {
            Swal.fire({
                icon: "warning",
                title: "이미지를 최소 한 장 이상 추가해 주세요.",
                showConfirmButton: true,
            });
            return false;
        }
    
        return true;
    };

    // 리뷰 수정 함수
    const handleReviewModifySubmit = () => {
        if (isSubmitting) return;
    
        setIsSubmitting(true);
    
        if (!isFormValid()) {
            Swal.fire({
                icon: "warning",
                title: "별점, 리뷰 내용, 그리고 이미지를 모두 입력해 주세요.",
                showConfirmButton: true,
            });
            setIsSubmitting(false);
            return;
        }
    
        const formData = new FormData();
    
        const reviewData = JSON.stringify({
            review_seq: reviewMod.review_seq,
            rating: data.rating,
            review_contents: data.review_contents,
            product_seq: data.product_seq,
            member_id: memberId 
        });

        formData.append('reviewData', reviewData);
        
        if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
                formData.append('newImages', image); 
            });
        }

        if (existImages && existImages.length > 0) {
            existImages.forEach((image) => {
                formData.append('existImages', image);
            });
        }

        data.images.forEach((_, index) =>
            formData.append('imageOrders', index + 1)
        )

        console.log("newImages : " + newImages);        

        api.post(`/product/reviewMod`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {
            Swal.fire({
                icon: "success",
                title: "리뷰 수정에 성공했습니다.",
                showConfirmButton: true,
            });
            
            // 리뷰 등록 성공 시, 새 리뷰를 추가하여 리뷰 목록을 업데이트
            const modReview = {
                RATING: data.rating,
                REVIEW_CONTENTS: data.review_contents,
                MEMBER_ID: memberId,
                REVIEW_DATE: new Date(), // 현재 시간을 등록 시간으로 사용
                images: [...existImages, ...newImages.map((src, index) => ({ IMAGE_URL: src }))], // 이미지 미리보기 배열을 사용하여 새 리뷰 이미지로 추가
            };
            
            // 수정된 리뷰 반영
            let modifiedReviews = reviews.map((review) => {
                if (review.REVIEW_SEQ === reviewMod.review_seq){
                    review.RATING = data.rating;
                    review.REVIEW_CONTENTS = data.review_contents;
                    review.REVIEW_DATE = new Date();
                    review.images = newImages.map((src, index) => ({ IMAGE_URL : src }));
                }
                
                return review;
            });

            setReviews(modifiedReviews);
            setIsReviewModalOpen(false); // 모달 닫기
        }).catch((error) => {
            alert('리뷰 수정에 실패했습니다');
            setIsReviewModalOpen(false);
        });

        setIsSubmitting(false);
    }

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
                images: newImages.map((src, index) => ({ IMAGE_URL: src })), // 이미지 미리보기 배열을 사용하여 새 리뷰 이미지로 추가
            };
            
            setReviews((prevReviews) => [newReview, ...prevReviews]); // 새 리뷰를 목록에 추가
            setTotalReviews(prevCount => prevCount + 1); // 전체 리뷰 수 업데이트
            setIsReviewModalOpen(false); // 모달 닫기
            setIsSubmitting(false); // 제출 상태 해제
        }).catch((error) => {
            alert('리뷰 제출에 실패했습니다');
            setIsReviewModalOpen(false);
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

    const [sortType, setSortType] = useState('latest');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const resp = await getReviewList(product_seq, page, itemsPerPage, sortType);
                const ratingResp = await getRatings(product_seq);
                const reviewsData = resp.data.reviews;
                const ratingsData = ratingResp.data;
                // console.log("테스트중1"+JSON.stringify(reviewsData));
                // console.log("테스트중2"+JSON.stringify(ratingsData));
                
    
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
                        if (memberId && review.MEMBER_ID && review.MEMBER_ID !== "null") { 
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
                    // console.log(reviewsData);
                    
    
                    // 평균 별점 계산
                    const totalRating = ratingsData.reduce((acc, review) => acc + review.rating, 0); 
                    const averageRating = totalRating / ratingsData.length; // 평균 계산
                    setAverageRating(averageRating);

                    // 별점 카운트 업데이트
                    const newRatingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                    ratingsData.forEach(review => newRatingsCount[review.rating]++);
                    setRatingsCount(newRatingsCount);
                    // console.log("1: " + JSON.stringify(newRatingsCount));
                    console.log("2: " + JSON.stringify(ratingsCount));
                    console.log("2: " + JSON.stringify(ratingsData));

                    
                    

                    // 각 리뷰의 좋아요 수를 가져옴 
                    const likePromises = reviewsData.map(async (review) => {
                        try {
                            const likeResp = await getReviewLikeCount(review.REVIEW_SEQ);
                            const likeStatusResp = await checkReviewLikeStatus(review.REVIEW_SEQ, memberId); //좋아요 확인

                            return {
                                reviewSeq: review.REVIEW_SEQ,
                                likeCount: likeResp.data || 0,
                                liked: likeStatusResp.data || false, // 좋아요 상태
                            };
                        } catch (error) {
                            return { reviewSeq: review.REVIEW_SEQ, likeCount: 0, liked: false }; // 오류 발생 시 기본값
                        }
                    });
                    const likeData = await Promise.all(likePromises);
                    // console.log("각 리뷰의 좋아요 데이터 확인중"+likeData);

                    const newLikeCount = {};
                    const newLikedStatus = {};
                    likeData.forEach(({ reviewSeq, likeCount, liked }) => {
                        newLikeCount[reviewSeq] = likeCount; // 각 리뷰의 좋아요 수 저장
                        newLikedStatus[reviewSeq] = liked;  // 각 리뷰의 좋아요 상태 저장
                    });

                    setLikeCount(newLikeCount); // 좋아요 수 상태 업데이트
                    setLiked(newLikedStatus);    // 좋아요 상태 업데이트
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
    }, [product_seq, page, itemsPerPage, isReviewModalOpen, sortType]);
    // console.log(liked);
    
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

    // 리뷰 삭제
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

    const [reviewMod, setReviewMod] = useState({}); // 리뷰별로 수정 모드 관리

    // 리뷰 수정 모드 활성화
    const handleModify = (review) => {
        setReviewMod({
            'state' : true,
            'review_seq' : review.REVIEW_SEQ
        });
        handleOpenReviewModifyModal(review);
    };

    // 리뷰 좋아요 '도움이 돼요'
    const handleLikeClick = (reviewSeq) => {
        if (!isAuth) {
            Swal.fire({
                icon: "warning",
                title: "로그인을 먼저 해주세요.",
                showConfirmButton: true,
            }).then(() => {
                // 로그인이 안된 경우 로그인 페이지로 이동
                navi('/signIn');
            });
            return;
        }

        // 현재 리뷰에 좋아요가 이미 눌린 경우, 취소 여부를 묻는 확인창을 띄움
        if (liked[reviewSeq]) {
            Swal.fire({
                title: "좋아요를 취소하시겠습니까?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "네, 취소합니다",
                cancelButtonText: "아니오",
            }).then((result) => {
                if (result.isConfirmed) {
                    // 좋아요 취소 로직
                    setLiked((prev) => ({ ...prev, [reviewSeq]: false }));
                    setLikeCount((prev) => ({ ...prev, [reviewSeq]: (prev[reviewSeq] || 1) - 1 }));

                    // 좋아요 취소 요청 보내기
                    reviewUnlike(reviewSeq, memberId)
                        .then((resp) => {console.log('리뷰 좋아요 취소 성공:', resp);})
                        .catch((error) => {
                            console.error('리뷰 좋아요 취소 실패:', error);
                            // 실패 시 좋아요 상태 복구
                            setLiked((prev) => ({ ...prev, [reviewSeq]: true }));
                            setLikeCount((prev) => ({ ...prev, [reviewSeq]: (prev[reviewSeq] || 0) + 1 }));
                        });
                }
            });
        } else {
            // 좋아요 추가
            setLiked((prev) => ({ ...prev, [reviewSeq]: true }));
            setLikeCount((prev) => ({ ...prev, [reviewSeq]: (prev[reviewSeq] || 0) + 1 }));

            // 좋아요 요청 보내기
            reviewLike(reviewSeq, memberId)
                .then((resp) => {console.log('리뷰 좋아요 성공:', resp);})
                .catch((error) => {
                    console.error('리뷰 좋아요 추가 실패:', error);
                    // 좋아요 추가 실패 시 원상복구
                    setLiked((prev) => ({ ...prev, [reviewSeq]: false }));
                    setLikeCount((prev) => ({ ...prev, [reviewSeq]: (prev[reviewSeq] || 1) - 1 }));
                });
        }
    };

    // 리뷰 정렬 타입 변경
    const handleChangeSortType = (sortType) => {
        setSortType(sortType);
    }

    return (
        <div className={styles.container}>
            {/* 상품 리뷰 내용 */}

            <div className={styles.reviewsBox}>
                <div className={styles.reviewsHeader}>
                    <div>리뷰 {reviews.length} </div>
                    
                    {isAuth ? (
                        // 로그인 상태일 때
                        <div onClick={handleOpenReviewModal} style={{ cursor: 'pointer'}}>리뷰쓰기</div>
                    ) : (
                        // 로그인이 되어 있지 않을 때
                        <div>로그인 후 리뷰를 작성할 수 있습니다.</div>
                    )}

                    {/* 리뷰 모달 */}
                    {isReviewModalOpen && (
                        <Modal isOpen={isReviewModalOpen} onClose={handleCloseReviewModal}>
                            <div className={styles.modalBox}>
                                {/* {console.log("reviewMod : " + reviewMod)} */}
                                {
                                reviewMod.state === false ? 
                                ( <h2>리뷰 쓰기</h2> )
                                : 
                                ( <h2>리뷰 수정</h2> )
                                }
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
                                    {
                                        reviewMod.state === false ? 
                                        <>
                                            <button onClick={handleSubmit} disabled={isSubmitting}>
                                                {isSubmitting ? '제출 중...' : '리뷰 제출'}
                                            </button>
                                        </>
                                    : 
                                        <>
                                            <button onClick={handleReviewModifySubmit} disabled={isSubmitting}>
                                                {isSubmitting ? '제출 중...' : '리뷰 수정'}
                                            </button>
                                        </>
                                    }
                                </div>
                            </div>
                        </Modal>
                    )}
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
                        <div onClick={() => handleChangeSortType('best')}>베스트순</div>
                        <div onClick={() => handleChangeSortType('latest')}>최신순</div>
                    </div>
                    <div className={styles.reviewBox}>
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
                                                <div>
                                                    <StarRating rating={review.RATING}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {/* 세션 memberId와 review.MEMBER_ID가 같을 때만 수정/삭제 버튼을 보여줌 */}
                                            {memberId === review.MEMBER_ID ? (
                                            <>
                                                <button onClick={() => handleModify(review)}>수정</button>
                                                <button onClick={() => handleReviewDel(review.REVIEW_SEQ)}>삭제</button>
                                            </>
                                            ) : (
                                                <>
                                                    {/* 본인이 작성한 리뷰가 아닐 때만 좋아요/신고 버튼을 보여줌 */}
                                                    <button 
                                                        onClick={() => handleLikeClick(review.REVIEW_SEQ)} 
                                                        style={{ cursor: 'pointer' }} 
                                                    >
                                                        {likeCount[review.REVIEW_SEQ] > 0 && (<span>{likeCount[review.REVIEW_SEQ]}</span>)}&nbsp; 도움이 돼요
                                                    </button>

                                                    <button onClick={() => handleOpenReportModal(review.REVIEW_SEQ)}>신고하기</button>
                                                    {/* 신고 모달 (신고 모달이 열려 있고, 선택된 리뷰와 현재 리뷰가 동일할 때만 신고 모달을 표시) */}
                                                    {isReportModalOpen && selectedReviewSeq === review.REVIEW_SEQ && (
                                                        <ReportModal
                                                            reviewSeq={selectedReviewSeq}
                                                            memberId={review.MEMBER_ID} 
                                                            isOpen={isReportModalOpen}
                                                            onClose={handleCloseReportModal}
                                                        />
                                                    )}
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
                        <Paging page={page} count={totalReviews} perpage={itemsPerPage} setPage={handlePageChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};
