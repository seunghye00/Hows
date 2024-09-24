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
import profile from '../../../../assets/images/기본사진.jpg'

import { useEffect, useState, useRef } from "react";
import { Scrap } from "./Scrap/Scrap";
import { Guestbook } from "./Guestbook/Guestbook";
import { Modal } from "../../../../components/Modal/Modal"
import { useAuthStore, useMemberStore } from "../../../../store/store";
import { countBookmark, countGuestbook, countPost, deleteImage, eachFollow, findMemberSeq, getCountFollow, getFollower, getFollowing, selectInfo, toggleFollow, uploadImage, uploadProfileImage, userInfo } from "../../../../api/member";
import { TextBox } from './TextBox/TextBox';
import Swal from "sweetalert2";
import { jwtDecode } from 'jwt-decode';

export const Main = () => {
    const navi = useNavigate()
    const location = useLocation()
    const profileInputRef = useRef(null); // 프로필 이미지 ref 생성
    const bannerInputRef = useRef(null); // 배너 이미지 ref 생성

    const [user, setUser] = useState([])
    const { member_id } = useParams() // URL에서 member_id 가져오기
    const { memberSeq, setMemberSeq } = useMemberStore()
    const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태
    const [selectedProfileImage, setSelectedProfileImage] = useState(profile) // 프로필사진 초기값
    const [selectedBannerImage, setSelectedBannerImage] = useState(banner) // 배너사진 초기값

    const [modalContent, setModalContent] = useState('') // 모달 창에 표시할 내용을 구분하는 상태

    const [postData, setPostData] = useState(0); // 게시물 개수
    const [scrapData, setScrapData] = useState(0); // 스크랩 개수
    const [guestbookData, setGuestbookData] = useState(0); // 방명록 개수

    const [countFollow, setCountFollow] = useState({}); // 팔로워, 팔로잉 수
    const [followerData, setFollowerData] = useState([]); // 팔로워 데이터
    const [followingData, setFollowingData] = useState([]); // 팔로잉 데이터

    const { currentUser, setCurrentUser } = useMemberStore();
    const token = sessionStorage.getItem("token");
    const session_member_id = sessionStorage.getItem('member_id') || ''; // 세션에서 member_id 가져오기, 없으면 빈 문자열
    const session_member_seq = token ? jwtDecode(token).member_seq : ''; // token이 있으면 member_seq 가져오기, 없으면 빈 문자열
    const [isEachFollow, setIsEachFollow] = useState(false);
    const { isAuth } = useAuthStore() // 로그인 여부 확인

    useEffect(() => {
        // url에서 가져온 member_id로 해당 페이지 member_id의 데이터 가져오기
        if (member_id) {
            userInfo(member_id).then((resp) => {
                setUser(resp.data);
                // 사용자 정보에서 프로필 이미지 설정
                setSelectedProfileImage(resp.data.member_avatar || profile); // 기본 프로필 이미지로 초기화
                setSelectedBannerImage(resp.data.member_banner || banner); // 기본 배너 이미지로 초기화

            }).catch(err => {
                console.log(err);
            })
            findMemberSeq(member_id).then((resp) => {
                setMemberSeq(resp.data); // zustand에 memberSeq 저장
            });
        }
    }, [member_id, setMemberSeq])

    useEffect(() => {
        // 게시물 개수
        countPost(member_id).then((resp) => {
            setPostData(resp.data);
        })
        // 북마크 개수
        countBookmark(member_id).then((resp) => {
            setScrapData(resp.data);
        })
        // 방명록 개수
        countGuestbook(memberSeq).then((resp) => {
            setGuestbookData(resp.data);
        })
    }, [member_id, memberSeq])


    // ref를 사용하여 프로필 사진 input 클릭
    const handleProfileInputClick = () => {
        profileInputRef.current.click();
    };
    // ref를 사용하여 배너 사진 input 클릭
    const handleBannerInputClick = () => {
        bannerInputRef.current.click();
    };

    // 서버로 이미지 업로드 함수
    const handleUploadImage = (file, imageType) => {
        uploadImage(file, memberSeq, imageType).then(resp => {
            if (imageType === 'profile') {
                // 업로드 후 상태 업데이트
                setSelectedProfileImage(resp.data) // 서버에서 반환된 이미지 URL로 업데이트
                sessionStorage.setItem("member_avatar", resp.data);
                setCurrentUser({ ...currentUser, "member_avatar": resp.data });
            } else if (imageType === 'banner') {
                setSelectedBannerImage(resp.data);
            }
        })
            .catch(error => {
                console.error('이미지 업로드 실패:', error)
            })
    }

    // 프로필 사진 삭제
    const handleDeleteImage = (imageType) => {
        deleteImage(memberSeq, imageType).then(resp => {
            if (resp.data === "이미지가 성공적으로 삭제되었습니다.") {
                Swal.fire({
                    title: `${imageType === 'profile' ? '프로필' : '배너'} 삭제`,
                    text: `${imageType === 'profile' ? '프로필' : '배너'} 사진이 삭제되었습니다.`,
                    icon: "success",
                    confirmButtonText: "확인",
                });
            }
            if (imageType === 'profile') {
                setSelectedProfileImage(profile); // 프로필 기본 이미지로 변경
                sessionStorage.setItem("member_avatar", profile); // 기본 이미지로 sessionStorage 업데이트
                setCurrentUser({ ...currentUser, "member_avatar": profile }); // Zustand 상태 업데이트
            } else if (imageType === 'banner') {
                setSelectedBannerImage(banner); // 배너 기본 이미지로 변경
            }
        })
            .catch(error => {
                console.error('이미지 삭제 실패:', error)
            })
    }

    // 팔로워, 팔로잉 수
    useEffect(() => {
        if (memberSeq > 0) {
            getCountFollow(memberSeq).then(resp => {
                setCountFollow(resp.data);
            })
        }
    }, [memberSeq])

    // 팔로워, 팔로잉 목록 출력
    const handleFollow = (memberSeq, type) => {
        if (type === "follower") {
            getFollower(memberSeq).then(resp => {
                setFollowerData(resp.data);
            })
        } else if (type === "following") {
            getFollowing(memberSeq).then(resp => {
                setFollowingData(resp.data);
            })
        }
    }

    // 팔로우, 팔로잉 상태 변경 
    const handleIsFollowing = (targetMemberSeq) => {
        if (!isAuth || !session_member_seq) {
            Swal.fire({
                icon: 'warning',
                text: '로그인 후 이용할 수 있습니다.',
                showConfirmButton: true,
            }).then(() => {
                navi('/signIn') // 로그인 페이지로 이동
            })
            return
        }

        toggleFollow({
            from_member_seq: session_member_seq, // 로그인한 사용자의 member_seq
            to_member_seq: targetMemberSeq, // 팔로우할 대상의 member_seq (팔로잉 취소)
            checkStatus: false, // 팔로우 상태 변경 

        }).then(resp => {
            // 팔로우 상태 업데이트
            setFollowerData(prevList =>
                prevList.map(item =>
                    item.MEMBER_SEQ === targetMemberSeq
                        ? { ...item, IS_FOLLOWING: resp.data.isFollowing ? "Y" : "N" }
                        : item
                )
            )
            // 팔로잉 상태 업데이트 
            setFollowingData(prevList =>
                prevList.map(item =>
                    item.MEMBER_SEQ === targetMemberSeq
                        ? { ...item, IS_FOLLOWING: resp.data.isFollowing ? "Y" : "N" }
                        : item
                )
            )
            // 팔로워, 팔로잉 수 업데이트
            getCountFollow(memberSeq).then(resp => {
                setCountFollow(resp.data); // 팔로워, 팔로잉 수 업데이트
            });
        })
    }

    // [마이페이지 메인 팔로우 버튼] 내가 상대방 팔로우 했는지 버튼 표시 
    useEffect(() => {
        if (memberSeq > 0 && session_member_seq > 0) {
            eachFollow(session_member_seq, memberSeq).then(resp => {
                setIsEachFollow(resp.data);
            });
        }
    }, [memberSeq, followerData, followingData])

    // 팔로우 목록에서 사용자 클릭 시 페이지 이동
    const handleMovePage = (memberId) => {
        navi(`/mypage/main/${memberId}/post`);
        setIsModalOpen(false);
    }

    return (
        <div className={styles.container}>
            {/* 배너 이미지: 사용자 본인일 때만 변경 가능 */}
            <div
                className={styles.bannerImg}
                onClick={() => {
                    if (sessionStorage.getItem('member_id') === user.member_id) {
                        setModalContent('banner')
                        setIsModalOpen(true)
                    }
                }}
                style={{ cursor: sessionStorage.getItem('member_id') === user.member_id ? 'pointer' : 'default' }}
            >
                <img src={selectedBannerImage} alt="banner" ></img>
            </div>
            <div className={styles.mainBox}>
                <div className={styles.header}>
                    {/* 프로필 이미지: 사용자 본인일 때만 변경 가능 */}
                    <div
                        className={styles.profile}
                        onClick={() => {
                            if (sessionStorage.getItem('member_id') === user.member_id) {
                                setModalContent('profile')
                                setIsModalOpen(true)
                            }
                        }}
                        style={{ cursor: session_member_id === user.member_id ? 'pointer' : 'default' }}
                    >
                        <img src={selectedProfileImage} alt="Profile" />
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
                                            <button className={styles.infoUpdate} onClick={() => navi('/mypage/update')} >
                                                수정
                                            </button>
                                            <button className={styles.mypage} onClick={() => navi('/history/delivery')} >
                                                My History
                                            </button>
                                        </>
                                    )}
                            </div>
                        </div>
                        <div className={styles.middle}>
                            <span className={styles.id}>@{user.member_id}</span>
                            <div className={styles.follower}>
                                <span className={styles.followText}> 팔로워 </span>
                                <span className={styles.followCount}
                                    onClick={() => { handleFollow(memberSeq, "follower"); setModalContent('follower'); setIsModalOpen(true) }}>{countFollow.FOLLOWER}</span>
                            </div>
                            <div className={styles.following}>
                                <span className={styles.followText}> 팔로잉 </span>
                                <span className={styles.followCount}
                                    onClick={() => { handleFollow(memberSeq, "following"); setModalContent('following'); setIsModalOpen(true) }}>{countFollow.FOLLOWING}</span>
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            {
                                session_member_id != user.member_id ?  // 본인일 때 표시 X
                                    <>
                                        {
                                            // 내가 팔로우한 상태라면 "팔로우 -" / 팔로우 하지 않은 상태라면 "팔로우 +"
                                            isEachFollow ?
                                                <button className={styles.delFollowBtn} onClick={() => handleIsFollowing(memberSeq)}> 팔로잉 </button>
                                                :
                                                <button className={styles.addFollowBtn} onClick={() => handleIsFollowing(memberSeq)}> 팔로우 + </button>
                                        }
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.menus}>
                    <div className={styles.menu} onClick={() => navi(`/mypage/main/${member_id}/post`)} >
                        <div className={location.pathname.includes('post') ? styles.active : ''} >
                            <i className="bx bx-grid"></i>
                            <span>게시물</span>
                        </div>
                    </div>
                    <div className={styles.menu} onClick={() => navi(`/mypage/main/${member_id}/scrap`)} >
                        <div className={location.pathname.includes('scrap') ? styles.active : ''} >
                            <i className="bx bx-bookmark"></i>
                            <span>스크랩</span>
                        </div>
                    </div>
                    <div className={styles.menu} onClick={() => navi(`/mypage/main/${member_id}/guestbook`)} >
                        <div className={location.pathname.includes('guestbook') ? styles.active : ''} >
                            <i className="bx bx-message-dots"></i>
                            <span>방명록</span>
                        </div>
                    </div>
                </div>

                {/* 바뀌는 부분 */}
                <div className={styles.body}>
                    <Routes>
                        <Route path="/" element={<Navigate to="post" replace />} />
                        <Route path="post" element={postData > 0 ? <Post data={postData} /> : <><Post data={postData} /> <TextBox text="게시물" /></>} />
                        <Route path="scrap" element={scrapData > 0 ? <Scrap data={scrapData} /> : <><Scrap data={scrapData} /><TextBox text="스크랩" /></>} />
                        <Route path="guestbook" element={guestbookData > 0 ? <Guestbook data={guestbookData} /> : <><Guestbook data={guestbookData} /><TextBox text="방문글" /></>} />
                    </Routes>
                </div>
            </div>

            {/* 모달 컴포넌트 */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {/* 프로필 사진 변경 */}
                {modalContent === 'profile' && (
                    <div className={styles.modalBox}>
                        <h2>프로필 사진 변경</h2>
                        <div>
                            <button className={styles.modBtn} onClick={handleProfileInputClick}>수정</button>
                            <button className={styles.delBtn} onClick={() => {
                                handleDeleteImage('profile'); // 서버에 프로필 이미지 삭제 요청
                                setIsModalOpen(false);
                            }}>삭제</button>
                        </div>
                        <input
                            ref={profileInputRef} // ref 할당
                            type="file"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0]
                                if (file) {
                                    const reader = new FileReader()
                                    reader.onloadend = () => {
                                        handleUploadImage(file, 'profile'); // 프로필 사진 서버로 전송
                                    };
                                    reader.readAsDataURL(file);
                                }
                                setIsModalOpen(false) // 모달 닫기
                            }}
                        />
                    </div>
                )}
                {/* 배너 사진 변경 */}
                {modalContent === 'banner' && (
                    <div className={styles.modalBox}>
                        <h2>배너 사진 변경</h2>
                        <p>사진은 1470 * 300 사이즈를 권장합니다</p>
                        <div>
                            <button className={styles.modBtn} onClick={handleBannerInputClick}>수정</button>
                            <button className={styles.delBtn} onClick={() => {
                                handleDeleteImage('banner'); // 서버에 배너 이미지 삭제 요청
                                setIsModalOpen(false)
                            }}>
                                삭제
                            </button>
                        </div>
                        <input
                            ref={bannerInputRef} // ref 할당
                            type="file"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0]
                                if (file) {
                                    const reader = new FileReader()
                                    reader.onloadend = () => {
                                        handleUploadImage(file, 'banner'); // 배너 사진 서버로 전송
                                    };
                                    reader.readAsDataURL(file);
                                }
                                setIsModalOpen(false) // 모달 닫기
                            }}
                        />
                    </div>
                )}
                {/* 팔로워 목록 */}
                {modalContent === 'follower' && (
                    <div className={styles.followListBox}>
                        <h2>팔로워 목록</h2>
                        <div>
                            {followerData.map((follower, i) => {
                                return (
                                    <div className={styles.followList} key={i}>
                                        <div className={styles.followImg}>
                                            <img src={follower.MEMBER_AVATAR || profile} />
                                        </div>
                                        <span onClick={() => handleMovePage(follower.MEMBER_ID)}>{follower.NICKNAME}</span>
                                        {
                                            follower.MEMBER_ID !== session_member_id ?
                                                (
                                                    follower.IS_FOLLOWING == "Y" ?
                                                        <button className={styles.followingBtn} onClick={() => handleIsFollowing(follower.MEMBER_SEQ)}>팔로잉</button>
                                                        :
                                                        <button className={styles.followerBtn} onClick={() => handleIsFollowing(follower.MEMBER_SEQ)}>팔로우</button>
                                                )
                                                : (
                                                    <></>
                                                )
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                {/* 팔로잉 목록 */}
                {modalContent === 'following' && (
                    <div className={styles.followListBox}>
                        <h2>팔로잉 목록</h2>
                        <div>
                            {followingData.map((following, i) => {
                                return (
                                    <div className={styles.followList} key={i}>
                                        <div className={styles.followImg}>
                                            <img src={following.MEMBER_AVATAR || profile} />
                                        </div>
                                        <span onClick={() => handleMovePage(following.MEMBER_ID)}>{following.NICKNAME}</span>
                                        {
                                            following.MEMBER_ID !== session_member_id ?
                                                (following.IS_FOLLOWING == "Y" ?
                                                    <button className={styles.followingBtn} onClick={() => handleIsFollowing(following.MEMBER_SEQ)}>팔로잉</button>
                                                    :
                                                    <button className={styles.followerBtn} onClick={() => handleIsFollowing(following.MEMBER_SEQ)}>팔로우</button>)

                                                : (
                                                    <></>
                                                )
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </Modal>
        </div >
    )
}