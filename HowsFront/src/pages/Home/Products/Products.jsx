import styles from './Products.module.css'
import { Main } from './Main/Main';
import { SubHeader } from './SubHeader/SubHeader';
import {useProductStore} from "../../../store/productStore";

export const Products = () => {

  const { subHeader, setSubHeader } = useProductStore();

  return (
    <div className={styles.container}>
      <div>
        {
          subHeader &&
          <SubHeader/>
        }
        <Main/>
      </div>
    </div>
  );
}