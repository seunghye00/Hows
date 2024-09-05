import styles from "./Guestbook.module.css";
import profile from "../../../../../assets/images/마이페이지_프로필사진.jpg";


export const Guestbook = () => {
    return (
        <div className={styles.container}>
            <div className={styles.countContents}>
                <span>3</span>
                <span>개의 방문글</span>
            </div>
            {/* =================== */}
            <div className={styles.visitPost}>
                <div className={styles.output}>
                    <img src={profile} />
                    <div>
                        <div className={styles.writer_writeDate}>
                            <span>dobby111</span>
                            <span> 2024-09-05 16:15</span>
                        </div>
                        <div className={styles.content}>내용입니다.</div>
                    </div>
                    <button>X</button>
                </div>
                <div className={styles.output}>
                    <img src={profile} />
                    <div>
                        <div className={styles.writer_writeDate}>
                            <span>dobby111</span>
                            <span> 2024-09-05 16:15</span>
                        </div>
                        <div className={styles.content}>내용입니다.</div>
                    </div>
                    <button>X</button>
                </div>
                <div className={styles.output}>
                    <img src={profile} />
                    <div>
                        <div className={styles.writer_writeDate}>
                            <span>dobby111</span>
                            <span> 2024-09-05 16:15</span>
                        </div>
                        <div className={styles.content}>내용입니다.</div>
                    </div>
                    <button>X</button>
                </div>
            </div>
        </div>
    );
};
