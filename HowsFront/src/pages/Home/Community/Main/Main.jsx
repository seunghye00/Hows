import styles from './Main.module.css'
import { Sort } from './Sort/Sort'
export const Main = () => {
    return (
        <div className={styles.communityWrap}>
            <Sort />
        </div>
    )
}
