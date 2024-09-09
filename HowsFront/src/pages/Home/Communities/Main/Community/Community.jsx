import { Sort } from './Sort/Sort'
import { Category } from './Category/Category'
import { Content } from './Content/Content'
import styles from './Community.module.css'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop'

export const Community = () => {
    return (
        <div>
            <Sort />
            <Category />
            <Content />
            <ScrollTop />
        </div>
    )
}
