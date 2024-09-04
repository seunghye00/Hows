import { Banner } from '../Banner/Banner';
import { Item } from './Item/Item';
import styles from './Product.module.css'
import { SubCategory } from './SubCategory/SubCategory';

export const Product = () => {
  return (
    <div className={styles.container}>
      <Banner/>
      <SubCategory/>
      <Item/>
    </div>
  );
}