import styles from './Category.module.css'
import img from '../../../../../assets/images/마이페이지_프로필사진.jpg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from '../../../../../config/config';

import img1 from '../../../../../assets/images/interior_1.jpg';
import img2 from '../../../../../assets/images/interior_2.jpg';
import img3 from '../../../../../assets/images/interior_3.jpg';
import img4 from '../../../../../assets/images/interior_4.jpg';
import img5 from '../../../../../assets/images/interior_5.jpg';
import img6 from '../../../../../assets/images/interior_6.jpg';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component'


// 데이터를 4개씩 묶는 함수
const chunkArray = (array, size) => {
  const result = []
  for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
  }
  return result
}


export const Category = () => {
  const navi = useNavigate();
  const [categoriesList,setCategoriesList] = useState([]); //카테고리 상태




  // ===== 옵션 =====
  const [selectedPriceType, setSelectedPriceType] = useState('') //가격 옵션 상태
  const [selectedSort, setSelectedSort] = useState('') // 정렬 상태

  // 선택 해제 함수
  const removeSelectedOption = optionType => {
      if (optionType === 'housing') setSelectedPriceType('')
      if (optionType === 'sort') setSelectedSort('') // 정렬 필터 해제
  }
  // ===== 옵션 =====



  // ===== 무한 스크롤 =====
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
  // ===== 무한 스크롤 =====

  


  // 카테고리 목록
  useEffect(() => {
    axios.get(`${host}/category`)
      .then((resp) => {
        // console.log(JSON.stringify(resp))
        setCategoriesList(resp.data);  
      })
      .catch((err) => {
        console.error(err); 
      });
  }, []);  // 컴포넌트가 처음 렌더링될 때 한 번만 실행



  return (
    <div className={styles.container}>
        <div className={styles.contents}>
          <div className={styles.side}>
              {
                categoriesList.map((item,i)=>{
                  return(
                    <ul className={styles.list} key={i}>
                      <li>{item.product_category_title}</li>
                    </ul>
                  )
                })
              }
          </div>
          <div className={styles.content}>

            <div>
              <div className={styles.option}>
                <div className={styles.sortBox}>
                    {/* 인기순/조회수순 선택 */}
                    <select
                        name="sortType"
                        value={selectedSort}
                        onChange={e => setSelectedSort(e.target.value)}
                        className={styles.sortSelect}
                    >
                        <option value="">정렬</option>
                        <option value="default">최신순</option>
                        <option value="popular">인기순</option>
                        <option value="review">리뷰많은순</option>
                        <option value="highPrice">낮은가격순</option>
                        <option value="lowPrice">높은가격순</option>
                    </select>
                    {/* 가격별 선택 */}
                    <select
                        name="housingType"
                        value={selectedPriceType}
                        onChange={e => setSelectedPriceType(e.target.value)}
                    >
                        <option value="">가격</option>
                        <option value="default">전체</option>
                        <option value="price1">50,000원 이하</option>
                        <option value="price2">50,000원 ~ 100,000원</option>
                        <option value="price3">100,000원 ~ 200,000원</option>
                        <option value="price4">200,000원 ~ 300,000원</option>
                        <option value="price5">300,000원 ~ 400,000원</option>
                        <option value="price6">400,000원 ~ 500,000원</option>
                        <option value="price7">500,000원 이상</option>
                    </select>
                </div>

                {/* 선택한 필터들 표시 */}
                <div className={styles.selectedOptions}>
                    {/* 정렬 필터 표시 */}
                    {selectedSort && selectedSort !== 'default' && (
                        <div className={styles.selectedOption}>
                            {selectedSort === 'popular' && '인기순'}
                            {selectedSort === 'views' && '조회수순'}
                            {selectedSort === 'review' && '인기순'}
                            {selectedSort === 'highPrice' && '조회수순'}
                            {selectedSort === 'lowPrice' && '조회수순'}
                            <button
                                onClick={() => removeSelectedOption('sort')}
                            >
                                X
                            </button>
                        </div>
                    )}

                    {selectedPriceType && (
                        <div className={styles.selectedOption}>
                            {selectedPriceType === 'popular' && '전체'}
                            {selectedPriceType === 'price1' && '50,000원 이하'}
                            {selectedPriceType === 'price2' && '50,000원 ~ 100,000원'}
                            {selectedPriceType === 'price3' && '100,000원 ~ 200,000원'}
                            {selectedPriceType === 'price4' && '200,000원 ~ 300,000원'}
                            {selectedPriceType === 'price5' && '300,000원 ~ 400,000원'}
                            {selectedPriceType === 'price6' && '400,000원 ~ 500,000원'}
                            {selectedPriceType === 'price7' && '500,000원 이상'}
                            <button
                                onClick={() => removeSelectedOption('space')}
                            >
                                X
                            </button>
                        </div>
                    )}
                </div>
              </div>
              <div className={styles.length}>{productsList.length}개</div>
            </div> 

            <div>
            <InfiniteScroll
                dataLength={productsList.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
      >
            {
              chunkedContentList.map((chunk, index) => (
                <div key={index} className={styles.itemBox}>
                  {
                    chunk.map((item)=>{
                      return(
                        <div className={styles.item} key={item.product_seq} onClick={()=>navi(`/products/${item.product_seq}`)}>
                          <div className={styles.img}><img src={item.product_thumbnail} alt='img'></img></div>
                          <div className={styles.title}>
                            <div>{item.product_title}</div>
                            <div>{item.price}</div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              ))
            }
            </InfiniteScroll>
            </div>
          </div>
        </div>
    </div>
  );
}