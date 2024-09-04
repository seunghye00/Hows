import styles from './Products.module.css'
import { Main } from './Main/Main';
import { SubHeader } from './SubHeader/SubHeader';
import { Route, Routes } from 'react-router-dom';

export const Products = () => {
  return (
    <div className={styles.conteiner}>
      <div>
        <SubHeader/>
        <Main/>
      </div>
    </div>
  );
}