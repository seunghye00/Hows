import styles from "./Main.module.css";
import { Post } from "./Post/Post";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import img from "../../../../assets/images/마이페이지_가로배너.jpg";
import profile from "../../../../assets/images/마이페이지_프로필사진.jpg";

import { UpdateInfo } from "./../UpdateInfo/UpdateInfo";
import { useEffect } from "react";
import { api } from "./../../../../config/config";
import axios from "axios";
import { Scrap } from "./Scrap/Scrap";
import { Guestbook } from "./Guestbook/Guestbook";

export const Main = () => {
    const navi = useNavigate();

    useEffect(() => {
        api.get(`/member`).then((resp) => {
            console.log(resp.data);
        });
    });

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
                                <button
                                    className={styles.infoUpdate}
                                    onClick={() => navi("/updateInfo")}
                                >
                                    수정
                                </button>
                                <button
                                    className={styles.mypage}
                                    onClick={() => navi("/userDashboard")}
                                >
                                    마이페이지
                                </button>
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
                    <div className={styles.menu} onClick={() => navi("./post")}>
                        <div>
                            <i className="bx bx-grid"></i>
                            <span>게시물</span>
                        </div>
                    </div>
                    <div className={styles.menu} onClick={() => navi("./scrap")}>
                        <div>
                            <i className="bx bx-bookmark"></i>
                            <span>스크랩</span>
                        </div>
                    </div>
                    <div className={styles.menu} onClick={() => navi("./guestbook")}>
                        <div>
                            <i className="bx bx-message-dots"></i>
                            <span>집들이</span>
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

        </div>
    );
};
