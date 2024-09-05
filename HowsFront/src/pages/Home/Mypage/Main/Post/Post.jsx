import styles from "./Post.module.css";
import post from "../../../../../assets/images/마이페이지_게시물.jpg";

export const Post = () => {
  return (
    <div className={styles.container}>
      <div className={styles.countContents}>
        <span>4</span>
        <span>개의 게시물</span>
      </div>
      <div className={styles.contents}>
        <div className={styles.feed}>
          <img src={post}></img>
        </div>
        <div className={styles.feed}>
          <img src={post}></img>
        </div>
        <div className={styles.feed}>
          <img src={post}></img>
        </div>
        <div className={styles.feed}>
          <img src={post}></img>
        </div>
        <div className={styles.feed}>
          <img src={post}></img>
        </div>
      </div>
    </div>
  );
};
