import styles from './Main.module.css'
import { Post } from './Post/Post'
import {
    Routes,
    Route,
    Navigate,
    useNavigate,
    useLocation,
    useParams,
} from 'react-router-dom'
import banner from '../../../../assets/images/마이페이지_가로배너.jpg'
import profile from '../../../../assets/images/마이페이지_프로필사진.jpg'

import { useEffect, useState } from "react";
import { api } from "./../../../../config/config";
import { Scrap } from "./Scrap/Scrap";
import { Guestbook } from "./Guestbook/Guestbook";
import { Modal } from "../../../../components/Modal/Modal"
import { useMemberStore } from "../../../../store/store";
import { deleteProfileImage, findMemberSeq, selectInfo, uploadProfileImage, userInfo } from "../../../../api/member";

export const Main = () => {
    const navi = useNavigate()
    const location = useLocation()

    const [user, setUser] = useState([])
    const { member_id } = useParams() // URL에서 member_id 가져오기
    const { memberSeq, setMemberSeq } = useMemberStore()
    const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태
    const [selectedImage, setSelectedImage] = useState(profile) // 선택한 이미지 초기값
    // const [selectedFile, setSelectedFile] = useState(null); // 선택한 파일
    const [modalContent, setModalContent] = useState('') // 모달 창에 표시할 내용을 구분하는 상태

    useEffect(() => {
        // url에서 가져온 member_id로 해당 페이지 member_id의 데이터 가져오기
        if (member_id) {
            userInfo(member_id).then((resp) => {
                console.log("데이터 : ", resp.data);
                setUser(resp.data);
                // 사용자 정보에서 프로필 이미지 설정
                setSelectedImage(resp.data.member_avatar || profile); // 기본 이미지로 초기화

            }).catch(err => {
                console.log(err);
            })
            findMemberSeq(member_id).then((resp) => {
                console.log("member_seq : ", resp.data);
                setMemberSeq(resp.data); // zustand에 memberSeq 저장
            });
        }
    }, [member_id, setMemberSeq])

    // 서버로 이미지 업로드 함수
    const handleUploadProfileImage = (file) => {
        uploadProfileImage(file, memberSeq)
            .then(resp => {
                console.log('이미지 업로드 성공:', resp.data)
                // 업로드 후 상태 업데이트
                setSelectedImage(resp.data) // 서버에서 반환된 이미지 URL로 업데이트
            })
            .catch(error => {
                console.error('이미지 업로드 실패:', error)
            })
    }

    // 프로필 사진 삭제
    const handleDeleteProfileImage = () => {
        deleteProfileImage(memberSeq)
            .then(resp => {
                console.log('이미지 삭제 성공:', resp.data)
                setSelectedImage(profile) // 기본 이미지로 변경
            })
            .catch(error => {
                console.error('이미지 삭제 실패:', error)
            })
    }


    return (
        <div className={styles.container}>
            {/* 배너 이미지: 사용자 본인일 때만 변경 가능 */}
            <div
                className={styles.bannerImg}
                onClick={() => {
                    if (
                        sessionStorage.getItem('member_id') === user.member_id
                    ) {
                        setModalContent('banner')
                        setIsModalOpen(true)
                    }
                }}
                style={{
                    cursor:
                        sessionStorage.getItem('member_id') === user.member_id
                            ? 'pointer'
                            : 'default',
                }}
            >
                <img src={banner}></img>
            </div>
            <div className={styles.mainBox}>
                <div className={styles.header}>
                    {/* 프로필 이미지: 사용자 본인일 때만 변경 가능 */}
                    <div
                        className={styles.profile}
                        onClick={() => {
                            if (
                                sessionStorage.getItem('member_id') ===
                                user.member_id
                            ) {
                                setModalContent('profile')
                                setIsModalOpen(true)
                            }
                        }}
                        style={{
                            cursor:
                                sessionStorage.getItem('member_id') ===
                                user.member_id
                                    ? 'pointer'
                                    : 'default',
                        }}
                    >
                        <img src={selectedImage} alt="Profile" />
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.top}>
                            <div className={styles.nickname}>
                                {user.nickname}
                            </div>
                            <div className={styles.linkBtns}>
                                {sessionStorage.getItem('member_id') ===
                                    user.member_id && (
                                    <>
                                        <button
                                            className={styles.infoUpdate}
                                            onClick={() =>
                                                navi('/mypage/update')
                                            }
                                        >
                                            수정
                                        </button>
                                        <button
                                            className={styles.mypage}
                                            onClick={() =>
                                                navi('/mypage/userDashboard')
                                            }
                                        >
                                            마이페이지
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.middle}>
                            <span className={styles.id}>@{user.member_id}</span>
                            <div className={styles.follower}>
                                <span className={styles.followText}>
                                    팔로워
                                </span>
                                <span className={styles.followCount}>10</span>
                            </div>
                            <div className={styles.following}>
                                <span className={styles.followText}>
                                    팔로잉
                                </span>
                                <span className={styles.followCount}>30</span>
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            {sessionStorage.getItem('member_id') !=
                                user.member_id && ( // 본인이 아닐시에는 표시 X
                                <>
                                    <button className={styles.followBtn}>
                                        팔로우 +
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.menus}>
                    <div
                        className={styles.menu}
                        onClick={() => navi(`/mypage/main/${member_id}/post`)}
                    >
                        <div
                            className={
                                location.pathname.includes('post')
                                    ? styles.active
                                    : ''
                            }
                        >
                            <i className="bx bx-grid"></i>
                            <span>게시물</span>
                        </div>
                    </div>
                    <div
                        className={styles.menu}
                        onClick={() => navi(`/mypage/main/${member_id}/scrap`)}
                    >
                        <div
                            className={
                                location.pathname.includes('scrap')
                                    ? styles.active
                                    : ''
                            }
                        >
                            <i className="bx bx-bookmark"></i>
                            <span>스크랩</span>
                        </div>
                    </div>
                    <div
                        className={styles.menu}
                        onClick={() =>
                            navi(`/mypage/main/${member_id}/guestbook`)
                        }
                    >
                        <div
                            className={
                                location.pathname.includes('guestbook')
                                    ? styles.active
                                    : ''
                            }
                        >
                            <i className="bx bx-message-dots"></i>
                            <span>방명록</span>
                        </div>
                    </div>
                </div>

                {/* 바뀌는 부분 */}
                <div className={styles.body}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate to="post" replace />}
                        />
                        <Route path="post" element={<Post />} />
                        <Route path="scrap" element={<Scrap />} />
                        <Route path="guestbook" element={<Guestbook />} />
                    </Routes>
                </div>
            </div>

            {/* 모달 컴포넌트 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className={styles.modalBox}>
                    {modalContent === 'profile' && (
                        <>
                            <h2>프로필 사진 변경</h2>
                            <div>
                                <button className={styles.modBtn} onClick={() => {
                                    document.getElementById("fileInput").click(); // 파일 input 클릭
                                }}>수정</button>
                                <button className={styles.delBtn} onClick={() => {
                                    handleDeleteProfileImage(); // 서버에 이미지 삭제 요청
                                    setIsModalOpen(false);
                                }}>삭제</button>
                            </div>
                            <input
                                id="fileInput"
                                type="file"
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0]
                                    if (file) {
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            // setSelectedImage(reader.result); // 선택한 이미지 미리보기
                                            handleUploadProfileImage(file); // 이미지 서버로 전송
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                    setIsModalOpen(false) // 모달 닫기
                                }}
                            />
                        </>
                    )}

                    {modalContent === 'banner' && (
                        <>
                            <h2>배너 사진 변경</h2>
                            <p>사진은 1470 * 260 사이즈를 권장합니다</p>
                            <div>
                                <button className={styles.modBtn}>수정</button>
                                <button
                                    className={styles.delBtn}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    삭제
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    )
}
