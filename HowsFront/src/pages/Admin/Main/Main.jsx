import styles from './Main.module.css'

export const Main = () => {
    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.leftBox}>
                    <h1>How's DashBoard</h1>
                    <div className={styles.subBox}>
                        <div className={styles.contBox}>왼</div>
                        <div className={styles.contBox}>오</div>
                    </div>
                    <div className={styles.listBox}>리스트</div>
                </div>
                <div className={styles.rightBox}>오른쪽</div>
            </div>
            <div className={styles.row}>
                <div className={styles.graphBox}>그래프1</div>
                <div className={styles.graphBox}>그래프2</div>
            </div>
        </div>
    )
}
