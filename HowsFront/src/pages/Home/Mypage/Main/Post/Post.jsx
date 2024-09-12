import styles from "./Post.module.css";
import post from "../../../../../assets/images/마이페이지_게시물.jpg";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { selectPost } from "../../../../../api/member";

export const Post = () => {

  const { member_id } = useParams() // URL에서 member_id 가져오기
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    selectPost(member_id).then(resp => {
      console.log("출력 : ", resp.data);
      setPostList(resp.data);
    })
  }, [member_id]);


  return (
    <div className={styles.container}>
      <div className={styles.countContents}>
        <span>{postList.length}</span>
        <span>개의 게시물</span>
      </div>
      <div className={styles.contents} >
        {
          postList.map((item, i) => {
            return (
              <div className={styles.feed} key={i}>
                <img src={item.IMAGE_URL} alt={`Post ${i + 1}`} />
              </div>
            )
          })
        }
      </div>
    </div>
  );
};
