import styles from "./Main.module.css";
import { Post } from "./Post/Post";
// import { Scrap } from "./Scrap/Scrap";
// import { Guestbook } from "./Guestbook/Guestbook";
import { Routes, Route, Navigate } from "react-router-dom";
import img from '../../../../assets/images/마이페이지_가로배너.jpg'
import profile from '../../../../assets/images/마이페이지_프로필사진.jpg'
import post from '../../../../assets/images/마이페이지_게시물.jpg'

export const Main = () => {
    return (
        <div className={styles.container}>
            <div className={styles.bannerImg}>
                <img src={img}></img>
            </div>
            <div className={styles.mainBox}>
                <div className={styles.header}>
                    <div className={styles.profile}>
                        <img src={profile}></img>
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.top}>
                            <div className={styles.nickname}>Dobby</div>
                            <div className={styles.linkBtns}>
                                <button className={styles.infoUpdate}>수정</button>
                                <button className={styles.mypage}>마이페이지</button>
                            </div>
                        </div>
                        <div className={styles.middle}>
                            <span className={styles.id}>@dobby_66</span>
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
                            <button className={styles.followBtn}>팔로우 +</button>
                        </div>
                    </div>
                </div>
                <div className={styles.menus}>
                    <div className={styles.menu}>
                        <div>
                            <i className='bx bx-grid'></i>
                            <span>게시물</span>
                        </div>
                    </div>
                    <div className={styles.menu}>
                        <div>
                            <i className='bx bx-bookmark'></i>
                            <span>스크랩</span>
                        </div>
                    </div>
                    <div className={styles.menu}>
                        <div>
                            <i className='bx bx-message-dots'></i>
                            <span>집들이</span>
                        </div>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.row}>
                        <div className={styles.feed}>
                            <img src={post}></img>
                        </div>
                        <div className={styles.feed}>
                            <img src={post}></img>
                        </div>
                        <div className={styles.feed}>
                            <img src={post}></img>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Routes> */}
            {/* <Route path="/" element={<Navigate to="post" replace />} /> */}
            {/* <Route path="post" element={<Post />} /> */}
            {/* <Route path="scrap" element={<Scrap />} /> */}
            {/* <Route path="guestbook" element={<Guestbook />} /> */}
            {/* </Routes> */}
        </div>
    );
};
