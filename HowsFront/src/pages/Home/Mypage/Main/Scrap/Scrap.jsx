import styles from "./Scrap.module.css";
import scrap from "../../../../../assets/images/마이페이지_게시물2.jpg";

export const Scrap = () => {

    return (
        <div className={styles.container}>
            <div className={styles.countContents}>
                <span>7</span>
                <span>개의 스크랩</span>
            </div>
            <div className={styles.contents}>
                <div className={styles.feed}>
                    <img src={scrap}></img>
                </div>
                <div className={styles.feed}>
                    <img src={scrap}></img>
                </div>
                <div className={styles.feed}>
                    <img src={scrap}></img>
                </div>
                <div className={styles.feed}>
                    <img src={scrap}></img>
                </div>
                <div className={styles.feed}>
                    <img src={scrap}></img>
                </div>
                <div className={styles.feed}>
                    <img src={scrap}></img>
                </div>
                <div className={styles.feed}>
                    <img src={scrap}></img>
                </div>
            </div>
        </div>
    );
}