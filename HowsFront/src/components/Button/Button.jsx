import styles from './Button.module.css'

export const Button = ({ size, title, onClick }) => {
    return (
        <button className={styles[size]} onClick={onClick}>
            {title}
        </button>
    )
}
