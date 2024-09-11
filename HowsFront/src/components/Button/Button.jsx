import styles from './Button.module.css'

export const Button = ({ size, title, onClick, isChecked }) => {
    return (
        <button
            className={`${styles[size]} ${
                isChecked === 'Y' ? styles.checked : ''
            }`}
            onClick={onClick}
        >
            {title}
        </button>
    )
}
