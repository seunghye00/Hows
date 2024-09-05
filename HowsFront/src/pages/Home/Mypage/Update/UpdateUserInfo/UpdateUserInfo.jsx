import styles from "./UpdateUserInfo.module.css"
import profile from "../../../../../assets/images/마이페이지_프로필사진.jpg";

export const UpdateUserInfo = () => {
    return (
        <div className={styles.container}>
            <div className={styles.updateInfo}>
                <div className={styles.profileBox}>
                    <div className={styles.img}>
                        <img src={profile}></img>
                    </div>
                    <div className={styles.profileBtns}>
                        <button>변경</button>
                        <button>삭제</button>
                    </div>
                </div>
                <div className={styles.idBox}>
                    <span className={styles.title}>ID</span>
                    <input
                        type="text"
                        placeholder="dobby_66"
                        name="member_id"
                        className={styles.inputId}
                        disabled
                    ></input>
                </div>
                <div className={styles.nameBox}>
                    <span className={styles.title}>이름</span>
                    <input
                        type="text"
                        placeholder="홍길동"
                        name="name"
                        className={styles.inputName}
                        disabled
                    ></input>
                </div>
                <div className={styles.birthBox}>
                    <span className={styles.title}>생년월일</span>
                    <input
                        type="text"
                        placeholder="19990101"
                        name="birth"
                        className={styles.inputBirth}
                        disabled
                    ></input>
                </div>
            </div>
        </div>
    )
}