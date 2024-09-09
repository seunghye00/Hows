import styles from "./Guestbook.module.css";
import profile from "../../../../../assets/images/마이페이지_프로필사진.jpg";


export const Guestbook = () => {


    const handleWriteBtn = () => {

    }

    // const write_date = new Date(user.guestbook_write_date);
    // const write_currentDate = !isNaN(write_date)
    //     ? format(write_date, "yyyy-MM-dd")
    //     : "Invalid Date";

    return (
        <div className={styles.container}>
            <div className={styles.countContents}>
                <span>3</span>
                <span>개의 방문글</span>
            </div>
            {/* =================== */}
            <div className={styles.visitPost}>
                <div className={styles.input}>
                    <img src={profile} alt="" />
                    <div
                        // ref={inputRef} // ref 설정
                        className={styles.inputText}
                        contentEditable="true"
                        // onInput={handleInputReply}
                        suppressContentEditableWarning={true}
                    />
                    <button onClick={handleWriteBtn}>등록</button>
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
