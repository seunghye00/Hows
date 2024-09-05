import styles from './Main.module.css'
import { Sort } from './Sort/Sort'
import { Category } from './Category/Category'
export const Main = () => {
    return (
        <div className={styles.communityWrap}>
            <Sort />
            <Category />
        </div>
    )
}
