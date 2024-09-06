import styles from './Item.module.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component'

import img1 from '../../../../../../assets/images/interior_1.jpg';
import img2 from '../../../../../../assets/images/interior_2.jpg';
import img3 from '../../../../../../assets/images/interior_3.jpg';
import img4 from '../../../../../../assets/images/interior_4.jpg';
import img5 from '../../../../../../assets/images/interior_5.jpg';
import img6 from '../../../../../../assets/images/interior_6.jpg';


// 데이터를 4개씩 묶는 함수
const chunkArray = (array, size) => {
  const result = []
  for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
  }
  return result
}

export const Item = () => {
  const navi = useNavigate();

  const [productsList, setProductsList] = useState([]); // 데이터
  const [hasMore, setHasMore] = useState(true) // 더 불러올 데이터가 있는지 여부
  const [page, setPage] = useState(1) // 현재 페이지


  // 서버에서 받아온 데이터를 4개씩 묶어서 처리하는 함수
  const fetchData = async page => {
      if (page > 10) {
          // 페이지가 5 이상일 경우 더 이상 데이터를 불러오지 않음
          return []
      }

      // 임시 데이터
      const data = [
        {product_seq:1, product_thumbnail: img1,product_title:'상품명1', product_contents:'상품설명1', price:'30,000,000', product_category_code:'P1'},
        {product_seq:2, product_thumbnail: img2,product_title:'상품명2', product_contents:'상품설명2', price:'30,000,000', product_category_code:'P1'},
        {product_seq:3, product_thumbnail: img3,product_title:'상품명3', product_contents:'상품설명3', price:'100,000', product_category_code:'P2'},
        {product_seq:4, product_thumbnail: img4,product_title:'상품명4', product_contents:'상품설명4', price:'2,000,000', product_category_code:'P3'},
        {product_seq:5, product_thumbnail: img5,product_title:'상품명5', product_contents:'상품설명5', price:'8,000,000', product_category_code:'P4'},
        {product_seq:6, product_thumbnail: img6,product_title:'상품명6', product_contents:'상품설명6', price:'35,000', product_category_code:'P5'},
        {product_seq:7, product_thumbnail: img1,product_title:'상품명7', product_contents:'상품설명7', price:'30,000', product_category_code:'P6'},
        {product_seq:8, product_thumbnail: img2,product_title:'상품명8', product_contents:'상품설명8', price:'300,000', product_category_code:'P6'},
        {product_seq:9, product_thumbnail: img3,product_title:'상품명9', product_contents:'상품설명9', price:'130,000,000', product_category_code:'P1'},
        {product_seq:10, product_thumbnail: img4,product_title:'상품명10', product_contents:'상품설명10', price:'90,000,000', product_category_code:'P1'},
        {product_seq:11, product_thumbnail: img5,product_title:'상품명11', product_contents:'상품설명11', price:'80,000,000', product_category_code:'P1'},
        {product_seq:12, product_thumbnail: img6,product_title:'상품명12', product_contents:'상품설명12', price:'50,000,000', product_category_code:'P1'},
      ];
      return data;
  };


  useEffect(() => {
    const loadInitialData = async () => {
      const initialData = await fetchData(page);
      setProductsList(initialData); // 초기 데이터 설정
    };
    loadInitialData();
  }, []);  // 의존성 배열에 page 추가


  // 무한 스크롤로 데이터 추가 로드
  const loadMoreData = async () => {
      const nextPage = page + 1
      const newContent = await fetchData(nextPage)

      // 더 이상 데이터가 없으면 종료
      if (newContent.length === 0) {
          setHasMore(false)
      }

      // 4개씩 나누어서 렌더링할 데이터 설정
      setProductsList(prevList => [...prevList, ...newContent])
      setPage(nextPage) // 페이지 증가
  }

  // 데이터를 4개씩 묶음
  const chunkedContentList = chunkArray(productsList, 4)




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
                          <div>{item.price}</div>
                      </div>
                    </div>
                ))}
              </div>
          ))
        }
      </InfiniteScroll>
      </div>
  </div>
  );
}