import styles from "./Main.module.css";
import { Post } from "./Post/Post";
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import img from "../../../../assets/images/마이페이지_가로배너.jpg";
import profile from "../../../../assets/images/마이페이지_프로필사진.jpg";

import { useEffect, useState } from "react";
import { api } from "./../../../../config/config";
import { Scrap } from "./Scrap/Scrap";
import { Guestbook } from "./Guestbook/Guestbook";
import { Modal } from "../../../../components/Modal/Modal"

export const Main = () => {
    const navi = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState([]);
    const { member_id } = useParams(); // URL에서 member_id 가져오기
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [selectedImage, setSelectedImage] = useState(profile); // 선택한 이미지 초기값


    useEffect(() => {
        // url에서 가져온 member_id로 해당 페이지 member_id의 데이터 가져오기
        if (member_id) {
            api.get(`/member/selectInfo`, { params: { member_id } }).then((resp) => {
                console.log("데이터 : ", resp.data);
                setUser(resp.data);
            });
        }
    }, [member_id]);



    return (
        <div className={styles.container}>
            <div className={styles.bannerImg}>
                <img src={img}></img>
            </div>
            <div className={styles.mainBox}>
                <div className={styles.header}>
                    <div className={styles.profile} onClick={() => setIsModalOpen(true)}>
                        <img src={selectedImage} alt="Profile" />
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.top}>
                            <div className={styles.nickname}>{user.nickname}</div>
                            <div className={styles.linkBtns}>
                                {sessionStorage.getItem('member_id') === user.member_id && (
                                    <>
                                        <button className={styles.infoUpdate} onClick={() => navi("/mypage/update")}>
                                            수정
                                        </button>
                                        <button className={styles.mypage} onClick={() => navi("/mypage/userDashboard")}>
                                            마이페이지
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.middle}>
                            <span className={styles.id}>@{user.member_id}</span>
                            <div className={styles.follower}>
                                <span className={styles.followText}>팔로워</span>
                                <span className={styles.followCount}>10</span>
                            </div>
                            <div className={styles.following}>
                                <span className={styles.followText}>팔로잉</span>
                                <span className={styles.followCount}>30</span>
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            {sessionStorage.getItem('member_id') != user.member_id && ( // 본인이 아닐시에는 표시 X
                                <>
                                    <button className={styles.followBtn}>팔로우 +</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.menus}>
                    <div className={styles.menu} onClick={() => navi(`/mypage/main/${member_id}/post`)}>
                        <div className={location.pathname.includes("post") ? styles.active : ""}>
                            <i className="bx bx-grid"></i>
                            <span>게시물</span>
                        </div>
                    </div>
                    <div className={styles.menu} onClick={() => navi(`/mypage/main/${member_id}/scrap`)}>
                        <div className={location.pathname.includes("scrap") ? styles.active : ""}>
                            <i className="bx bx-bookmark"></i>
                            <span>스크랩</span>
                        </div>
                    </div>
                    <div className={styles.menu} onClick={() => navi(`/mypage/main/${member_id}/guestbook`)}>
                        <div className={location.pathname.includes("guestbook") ? styles.active : ""}>
                            <i className="bx bx-message-dots"></i>
                            <span>방명록</span>
                        </div>
                    </div>
                </div>

                {/* 바뀌는 부분 */}
                <div className={styles.body}>
                    <Routes>
                        <Route path="/" element={<Navigate to="post" replace />} />
                        <Route path="post" element={<Post />} />
                        <Route path="scrap" element={<Scrap />} />
                        <Route path="guestbook" element={<Guestbook />} />
                    </Routes>
                </div>
            </div>

            {/* 모달 컴포넌트 추가 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={styles.modalBox}>
                    <h2>프로필 사진 변경</h2>
                    <button className={styles.modBtn} onClick={() => {
                        document.getElementById("fileInput").click(); // 파일 input 클릭
                    }}>수정</button>
                    <button className={styles.delBtn} onClick={() => {
                        setSelectedImage(profile); // 기본 이미지로 변경
                        setIsModalOpen(false);
                    }}>삭제</button>
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }} // 숨김
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setSelectedImage(reader.result); // 선택한 이미지 업데이트
                                };
                                reader.readAsDataURL(file);
                            }
                            setIsModalOpen(false); // 모달 닫기
                        }}
                    />
                </div>
            </Modal>
        </div >

    );
};
