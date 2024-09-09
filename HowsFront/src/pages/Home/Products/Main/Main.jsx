import { Category } from './Category/Category';
import { Product } from './Product/Product';
import styles from './Main.module.css'
import { Route, Routes } from 'react-router-dom';
import { Best } from './Best/Best';
import { Detail } from './Detail/Detail';

export const Main = () => {
  return (
    <div className={styles.container}>
        <Routes>
            <Route path='/' element={<Product />} />
            <Route path='product' element={<Product />} />
            <Route path='category' element={<Category/>}></Route>
            <Route path='best' element={<Best/>}></Route>
            {/* <Route path='/:product_category_code' element={<Category/>}></Route> */}
            <Route path='/:product_seq' element={<Detail/>}></Route>
        </Routes>
    </div>
  );
}