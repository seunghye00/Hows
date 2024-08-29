import styles from './Home.module.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

export const Home = () => {
  return (
    <div className={styles.container}>
      Home
      <Router>
        <Routes>
          <Route path="/" />
          <Route path="/products" />
          <Route path="/community" />
          <Route path="/cart" />
          <Route path="/mypage" />
        </Routes>
      </Router>
    </div>
  );
}