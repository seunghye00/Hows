import styles from './Title.module.css'

export const Title = ({ title }) => {
    return <div className={styles.title}>{title}</div>
}

export default Title
