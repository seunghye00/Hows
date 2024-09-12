import styles from "./TextBox.module.css"

export const TextBox = ({ text }) => {

    return (
        <div className={styles.container}>
            <div className={styles.spanBox}>
                <span className={styles.text}>{text}</span>
                <span className={styles.text2}> 이 없습니다.</span>
            </div>
        </div>
    )
}