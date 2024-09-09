import styles from './Category.module.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from '../../../../../config/config';

import { useNavigate, useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component'
import { ScrollTop } from '../../../../../components/ScrollTop/ScrollTop';
import { addCommas } from '../../../../../commons/commons';
import { useLocation } from 'react-router-dom';


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
  const {product_category_code} = useParams();

  const [categoriesList,setCategoriesList] = useState([]); //카테고리 상태
  const [data, setData] = useState([]); //상품 List 상태

  const [selectedPriceType, setSelectedPriceType] = useState('') // [옵션] 가격 상태
  const [selectedSort, setSelectedSort] = useState('') // [옵션] 정렬 상태

  const [productsList, setProductsList] = useState([]); // [무한 스크롤] 데이터
  const [hasMore, setHasMore] = useState(true) // [무한 스크롤] 더 불러올 데이터가 있는지 여부
  const [page, setPage] = useState(1) // [무한 스크롤] 현재 페이지

  const location = useLocation(); // 현재 URL의 정보를 가져옴(subCategory)
  const queryParams = new URLSearchParams(location.search); //URL의 쿼리 문자열을 분석하여 쿼리 파라미터를 추출할 수 있는 URLSearchParams 객체 생성
  const categoryCode = queryParams.get('code'); // 쿼리 파라미터에서 'code'이름의 값을 가져옴
  // console.log("code : " + categoryCode);
  


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

  // 서버에서 받아온 데이터를 4개씩 묶어서 처리하는 함수
  const fetchData = async page => {
    if (page > 10) { // 페이지가 5 이상일 경우 더 이상 데이터를 불러오지 않음
      return []
    }
    // handleMenuClick('P1');
    return data;
  };
  
  // 데이터 리스트 값 변동되면 setProductsList 셋팅
  useEffect(() => {
    const loadInitialData = async () => {
      setProductsList(data); // 초기 데이터 설정
    };
    loadInitialData();
  }, [data, page]);
  
  
  
  // 카테고리 메뉴 출력
  useEffect(() => {
    axios.get(`${host}/category`).then((resp) => {
      
      setCategoriesList(resp.data);

      // 가구만 출력하거나, null 이 아니면 넘어온 카테고리 코드에 해당하는 카테고리 출력
      if (categoryCode == null)
        handleMenuClick('P1');
      else
        handleMenuClick(categoryCode);
      
    }).catch((err) => {console.error(err);});
  }, []);  // 컴포넌트가 처음 렌더링될 때 한 번만 실행
  
  
  
  // 카테고리 목록 출력
  const handleMenuClick = (product_category_code) => {
    
    axios.get(`${host}/product/category/${product_category_code}`).then((resp)=> {
      setData(resp.data);
      
    }).catch((err) => {console.error(err); });
  }
  
  useEffect(()=>{
    handleMenuClick(product_category_code);
  },[product_category_code]);


  // [옵션] 선택 해제 함수
  const removeSelectedOption = optionType => {
      if (optionType === 'housing') setSelectedPriceType('')
      if (optionType === 'sort') setSelectedSort('') // 정렬 필터 해제
  }



  return (
    <div className={styles.container}>
        <div className={styles.contents}>
          <div className={styles.side}>
              {
                categoriesList.map((item,i)=>{
                  return(
                    <ul className={styles.list} key={i}>
                      <li onClick={()=>handleMenuClick(item.product_category_code)} >{item.product_category_title}</li>
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
                            <div>{ addCommas(item.price || 0) }</div>
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
        <ScrollTop />
    </div>
  );
}