import styles from './Item.module.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScrollTop } from '../../../../../../components/ScrollTop/ScrollTop';
import axios from 'axios';
import { host } from '../../../../../../config/config';
import { addCommas } from '../../../../../../commons/commons';

// 데이터를 4개씩 묶는 함수
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const Item = () => {
  const navi = useNavigate();
  const [data, setData] = useState([]); 
  const [productsList, setProductsList] = useState([]); // 데이터
  const [hasMore, setHasMore] = useState(true) // 더 불러올 데이터가 있는지 여부
  const [page, setPage] = useState(1) // 현재 페이지
  
  // 전체 데이터를 한 번에 가져오기
  useEffect(() => {
    axios.get(`${host}/product`).then(resp => {
      setData(resp.data); 
      setProductsList(resp.data.slice(0, 10)); // 처음 10개만 렌더링
    }).catch(err => console.error(err));
  }, []);

  // 무한 스크롤로 데이터 추가 로드
  const loadMoreData = () => {
    const nextPage = page + 1;
    const startIndex = page * 10; // 현재 페이지 시작점 (10개씩)
    const endIndex = startIndex + 10; // 현재 페이지 끝점

    // 새로운 데이터를 productsList에 추가
    const newContent = data.slice(startIndex, endIndex);
    if (newContent.length === 0) {
      setHasMore(false);
      return;
    }

    setProductsList(prevList => [...prevList, ...newContent]);
    setPage(nextPage); // 페이지 증가
  };

  // 데이터를 4개씩 묶음
  const chunkedContentList = chunkArray(productsList, 4);

  return (
    <div className={styles.container}>
      <div className={styles.titleItem}>오늘의 추천 상품</div>
      <div className={styles.contents}>
        <InfiniteScroll
          dataLength={productsList.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {
            chunkedContentList.map((chunk, index) => (
              <div key={index} className={styles.itemBox}>
                {chunk.map((item) => (
                  <div
                    className={styles.item}
                    key={item.product_seq}
                    onClick={() => navi(`/products/${item.product_seq}`)}
                  >
                    <div className={styles.img}>
                      <img src={item.product_thumbnail} alt="img" />
                    </div>
                    <div className={styles.title}>
                      <div>{item.product_title}</div>
                      <div>{addCommas(item.price || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          }
        </InfiniteScroll>
        <ScrollTop />
      </div>
    </div>
  );
}
