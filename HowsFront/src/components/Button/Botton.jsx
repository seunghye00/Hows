import styles from './Botton.module.css'

export const Button = ({ size }) => {
  return (
    <button className={styles[size]}>Test</button>
  );
}
