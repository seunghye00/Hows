import styles from './Products.module.css'
import { Main } from './Main/Main';
import { SubHeader } from './SubHeader/SubHeader';

export const Products = () => {
  return (
    <div className={styles.container}>
      <div>
        <SubHeader/>
        <Main/>
      </div>
    </div>
  );
}