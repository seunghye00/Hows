import styles from "./Post.module.css";
import post from "../../../../../assets/images/마이페이지_게시물.jpg";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { api } from "../../../../../config/config";
import { selectPost } from "../../../../../api/member";

export const Post = () => {

  const { member_id } = useParams() // URL에서 member_id 가져오기

  useEffect(() => {
    selectPost(member_id).then(resp => {
      console.log(resp.data);
    })
  }, []);


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
