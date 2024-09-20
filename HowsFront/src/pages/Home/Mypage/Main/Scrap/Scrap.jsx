import styles from "./Scrap.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectBookmark } from "../../../../../api/member";

export const Scrap = () => {
  const navi = useNavigate();
  const { member_id } = useParams(); // URL에서 member_id 가져오기
  const [scrapList, setScrapList] = useState([]);

  useEffect(() => {
    selectBookmark(member_id).then((resp) => {
      setScrapList(resp.data);
    });
  }, [member_id]);

  const handleScrapClick = (board_seq) => {
    navi(`/communities/${board_seq}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.countContents}>
        <span>{scrapList.length}</span>
        <span>개의 스크랩</span>
      </div>
      <div className={styles.contents}>
        {scrapList.map((item, i) => {
          return (
            <div
              className={styles.feed}
              key={i}
              onClick={() => handleScrapClick(item.BOARD_SEQ)}
            >
              <img src={item.IMAGE_URL} alt={`Post ${i + 1}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
