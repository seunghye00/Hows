import styles from './Botton.module.css'

export const Button = ({ size, title, onClick }) => {
    return (
        <button className={styles[size]} onClick={onClick}>
            {title}
        </button>
    )
}
