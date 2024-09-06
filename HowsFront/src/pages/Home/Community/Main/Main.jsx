import styles from './Main.module.css'
import { Sort } from './Sort/Sort'
import { Category } from './Category/Category'
import { Content } from './Content/Content'
export const Main = () => {
    return (
        <div className={styles.communityWrap}>
            <Sort />
            <Category />
            <Content />
        </div>
    )
}
