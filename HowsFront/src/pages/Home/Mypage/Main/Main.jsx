import styles from "./Main.module.css";
import { Post } from "./Post/Post";
// import { Scrap } from "./Scrap/Scrap";
// import { Guestbook } from "./Guestbook/Guestbook";
import { Routes, Route, Navigate } from "react-router-dom";
import img from '../../../../assets/images/마이페이지_가로배너.jpg'

export const Main = () => {
    return (
        <div className={styles.container}>
            <div className={styles.bannerImg}>
                <img src={img}></img>
            </div>
            <div className={styles.mainBox}>

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
