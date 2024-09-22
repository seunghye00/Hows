import styles from './SubCategory.module.css'
import { useNavigate, useMatch, useLocation } from 'react-router-dom'

export const SubCategory = () => {
    const navigate = useNavigate()
    const location = useLocation() // 현재 경로를 가져오기 위한 훅
    const matchNotice = useMatch('/csservice/notice/*')
    const matchEvent = useMatch('/csservice/event/*')

    return (
        <div className={styles.subCategory}>
            <button
                className={`${styles.button} ${
                    location.pathname === '/csservice' || matchNotice
                        ? styles.active
                        : ''
                }`}
                onClick={() => navigate('/csservice/notice')}
            >
                Notice
            </button>
            <button
                className={`${styles.button} ${
                    matchEvent ? styles.active : ''
                }`}
                onClick={() => navigate('/csservice/event')}
            >
                Event
            </button>
            <button
                className={`${styles.button} ${
                    location.pathname === '/csservice/faq' ? styles.active : ''
                }`}
                onClick={() => navigate('/csservice/faq')}
            >
                FAQ
            </button>
        </div>
    )
}
