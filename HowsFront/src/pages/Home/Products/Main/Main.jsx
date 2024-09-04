import { Banner } from './Banner/Banner';
import { Category } from './Category/Category';
import { Product } from './Product/Product';
import styles from './Main.module.css'

export const Main = () => {
  return (
    <div>
      <Banner/>
      <Category/>
      <Product/>
    </div>
  );
}