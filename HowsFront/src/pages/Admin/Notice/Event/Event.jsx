import styles from './Event.module.css'
import { Paging } from '../../../../components/Pagination/Paging'

const Event = () => {
    return (
        <div className={styles.eventContainer}>
            <div className={styles.pagination}>
                <Paging />
            </div>
        </div>
    )
}

export default Event
