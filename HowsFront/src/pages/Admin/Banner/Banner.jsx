import styles from './Banner.module.css'
import img from '../../../assets/images/banner01.png'

export const Banner = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.cols}>
                    <input type="checkbox" name="" id="" />
                </div>
                <div className={styles.cols}>순서</div>
                <div className={styles.cols}>이미지</div>
                <div className={styles.cols}>등록 기간</div>
            </div>
            <div className={styles.list}>
                <div className={styles.rows}>
                    <div className={styles.cols}>
                        <input type="checkbox" name="" id="" />
                    </div>
                    <div className={styles.cols}>1</div>
                    <div className={styles.cols}>
                        <img src={img} />
                    </div>
                    <div className={styles.cols}>24.09.05 ~ 24.09.10</div>
                </div>
                <div className={styles.rows}></div>
                <div className={styles.rows}></div>
                <div className={styles.rows}></div>
                <div className={styles.rows}></div>
                <div className={styles.rows}></div>
                <div className={styles.rows}></div>
                <div className={styles.rows}></div>
                <div className={styles.rows}></div>
                <div className={styles.rows}></div>
            </div>
        </div>
    )
}
