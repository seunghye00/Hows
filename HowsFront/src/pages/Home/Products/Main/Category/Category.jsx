import styles from "./Category.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { host } from "../../../../../config/config";

import { useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { ScrollTop } from "../../../../../components/ScrollTop/ScrollTop";
import { addCommas } from "../../../../../commons/commons";
import { useLocation } from "react-router-dom";

export const Category = () => {
  const navi = useNavigate();
  const { product_category_code } = useParams();

  const [categoriesList, setCategoriesList] = useState([]); // 카테고리 상태
  const [data, setData] = useState([]); // 상품 목록 상태

  const [selectedPriceType, setSelectedPriceType] = useState(""); // [옵션] 가격 상태
  const [selectedSort, setSelectedSort] = useState("popular"); // [옵션] 정렬 상태, 기본값 'popular' 인기순

  const [productsList, setProductsList] = useState([]); // [무한 스크롤] 데이터
  const [hasMore, setHasMore] = useState(true); // [무한 스크롤] 더 불러올 데이터가 있는지 여부
  const [page, setPage] = useState(1); // [무한 스크롤] 현재 페이지

  const location = useLocation(); // 현재 URL의 정보를 가져옴(subCategory)
  const queryParams = new URLSearchParams(location.search); //URL의 쿼리 문자열을 분석하여 쿼리 파라미터를 추출할 수 있는 URLSearchParams 객체 생성
  const categoryCode = queryParams.get("code"); // 쿼리 파라미터에서 'code'이름의 값을 가져옴

  // 데이터를 4개씩 묶는 함수
  const chunkArray = (array = [], size, sortType, housingType) => {
    // console.log("초기 배열:", array);
    if (!array || array.length === 0) return []; // 배열이 없거나 비어 있을 경우 빈 배열 반환
  
    let filteredArray = array; // 초기값을 전체 배열로 설정
  
    // 가격 필터링
    if (housingType === "price1") {
      filteredArray = array.filter((item) => item.PRICE <= 10000);
    } else if (housingType === "price2") {
      filteredArray = array.filter((item) => item.PRICE > 10000 && item.PRICE <= 50000); 
    } else if (housingType === "price3") {
      filteredArray = array.filter((item) => item.PRICE > 50000 && item.PRICE <= 100000);
    } else if (housingType === "price4") {
      filteredArray = array.filter((item) => item.PRICE > 100000 && item.PRICE <= 150000); 
    } else if (housingType === "price5") {
      filteredArray = array.filter((item) => item.PRICE > 150000 && item.PRICE <= 200000); 
    } else if (housingType === "price6") {
      filteredArray = array.filter((item) => item.PRICE > 200000 );
    } else if (housingType === "price") {
      filteredArray = array;
    }else {
      filteredArray = array; // 가격 필터링이 없으면 전체 배열을 사용
    }
  
    // 정렬 옵션에 따른 데이터 정렬
    let tmp = filteredArray.slice();
    if (sortType === "popular") {
      tmp = tmp.slice().sort((a, b) => b.LIKE_COUNT - a.LIKE_COUNT); // 인기순
    } else if (sortType === "latest") {
      tmp = tmp.slice().sort((a, b) => b.PRODUCT_SEQ - a.PRODUCT_SEQ); // 최신순
    } else if (sortType === "oldest") {
      tmp = tmp.slice().sort((a, b) => a.PRODUCT_SEQ - b.PRODUCT_SEQ); // 오래된 순
    } else if (sortType === "row_price") {
      tmp = tmp.slice().sort((a, b) => a.PRICE - b.PRICE); // 낮은 가격순
    } else if (sortType === "high_price") {
      tmp = tmp.slice().sort((a, b) => b.PRICE - a.PRICE); // 높은 가격순
    } 
  
    // console.log("정렬된 배열:", tmp); // 정렬된 배열 확인
  
    // 데이터를 4개씩 묶음
    const result = [];
    for (let i = 0; i < tmp.length; i += size) {
      result.push(tmp.slice(i, i + size));
    }
  
    // console.log("4개씩 묶인 배열:", result); // 묶은 후 배열 확인
    return result;
  };
  
  // 무한 스크롤로 데이터 추가 로드
  const loadMoreData = async () => {
    const nextPage = page + 1;
    const newContent = await fetchData(nextPage);
  
    // 중복된 데이터 제거
    const combinedProducts = [...new Set([...productsList, ...newContent])]; 
    setProductsList(combinedProducts);
  
    // 더 이상 데이터가 없으면 종료
    if (newContent.length === 0) {
      setHasMore(false); // 더 이상 데이터가 없을 경우 무한 스크롤 중지
    } else {
      setPage(nextPage); // 페이지 증가
    }
  };

  // 서버에서 받아온 데이터를 4개씩 묶어서 처리하는 함수
  const fetchData = async (page) => {
    if (page > 10) {
      return [];
    }
    return data || []; // 비어 있을 경우 빈 배열 반환
  };

  // 데이터 리스트 값 변동되면 setProductsList 셋팅
  useEffect(() => {
    if (data && data.length > 0) {
      setProductsList(data); // data가 변경되면 productsList 업데이트
    } else {
      console.log("No data:", data);
    }
  }, [data]);

  // 카테고리 메뉴 출력
  useEffect(() => {
    axios
      .get(`${host}/category`)
      .then((resp) => {
        setCategoriesList(resp.data);

        if (categoryCode == null) handleMenuClick("P1");
        else handleMenuClick(categoryCode);

      }).catch((err) => {console.error(err);});
  }, []);
  
  // chunkedContentList 선언 및 상태 추적
  const chunkedContentList = chunkArray(productsList || [], 4, selectedSort); // undefined 방지

  // 카테고리 목록 출력
  const handleMenuClick = (product_category_code) => {
    // console.log(product_category_code)
    // 기존 데이터 초기화
    setProductsList([]);
    axios.get(`${host}/product/category/${product_category_code}`) // 서버에서 기본적으로 인기순 데이터를 받아옴
      .then((resp) => {
        setData(resp.data);
        // console.log(resp.data);
        
      })
      .catch((err) => {console.error(err);});
  };
  // console.log(data);
  
  useEffect(() => {
    handleMenuClick(product_category_code);
  }, [product_category_code]);

  // 상태값이 변경될 때마다 데이터를 다시 필터링
  useEffect(() => {
    if (data.length > 0) {
        const sortedAndFilteredList = chunkArray(data, 4, selectedSort, selectedPriceType); // 정렬 및 필터링 후 리스트 업데이트
        // console.log("필터링된 데이터: ", sortedAndFilteredList); // 필터링 후 데이터 확인
        setProductsList(sortedAndFilteredList.flat()); // 4개씩 묶은 후 다시 평탄화(flat)
    }
  }, [selectedSort, selectedPriceType, data]);  // 필터 값이 변경될 때 실행


  // [옵션] 선택 해제 함수
  const removeSelectedOption = (optionType) => {
    if (optionType === "price") {
      setSelectedPriceType(""); // 가격 필터 해제
      setProductsList(data); //전체 데이터로 초기화하고 필터 해제 후 전체 목록 표시
    }
    if (optionType === "sort") {
      setSelectedSort("popular"); // 정렬 필터 해제, 인기순으로 기본값 설정
      setProductsList(data);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contents}>
        <div className={styles.side}>
          {categoriesList.map((item, i) => {
            return (
              <ul className={styles.list} key={i}>
                <li onClick={() => handleMenuClick(item.product_category_code)}>
                  {item.product_category_title}
                </li>
              </ul>
            );
          })}
        </div>
        <div className={styles.content}>
          <div>
            <div className={styles.option}>
              <div className={styles.sortBox}>
                <select
                  name="sortType"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="popular">인기순</option>
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된순</option>
                  <option value="row_price">낮은가격순</option>
                  <option value="high_price">높은가격순</option>
                </select>
                <select
                  name="housingType"
                  value={selectedPriceType}
                  onChange={(e) => {
                    setSelectedPriceType(e.target.value)
                  }}
                >
                  <option value="">가격</option>
                  <option value="price">전체</option>
                  <option value="price1">10,000원 이하</option>
                  <option value="price2">10,000원 ~ 50,000원</option>
                  <option value="price3">50,000원 ~ 100,000원</option>
                  <option value="price4">100,000원 ~ 150,000원</option>
                  <option value="price5">150,000원 ~ 200,000원</option>
                  <option value="price6">200,000원 ~</option>
                </select>
              </div>

              {/* 선택한 필터들 표시 */}
              <div className={styles.selectedOptions}>
              {selectedSort !== "popular" && (
                <div className={styles.selectedOption}>
                  {selectedSort === "latest" && "최신순"}
                  {selectedSort === "oldest" && "오래된순"}
                  {selectedSort === "row_price" && "낮은가격순"}
                  {selectedSort === "high_price" && "높은가격순"}
                  <button onClick={() => removeSelectedOption("sort")}>X</button>
                </div>
              )}

                {/* 선택한 필터들 표시 */}
                {selectedPriceType && (
                  <div className={styles.selectedOption}>
                    {selectedPriceType === "price" && "전체"}
                    {selectedPriceType === "price1" && "10,000원 이하"}
                    {selectedPriceType === "price2" && "10,000원 ~ 50,000원"}
                    {selectedPriceType === "price3" && "50,000원 ~ 100,000원"}
                    {selectedPriceType === "price4" && "100,000원 ~ 150,000원"}
                    {selectedPriceType === "price5" && "150,000원 ~ 200,000원"}
                    {selectedPriceType === "price6" && "200,000원 ~"}
                    <button onClick={() => removeSelectedOption("price")}>X</button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.length}>{productsList.length}개</div>
          </div>

          <div>
            <InfiniteScroll
              dataLength={productsList.length || 0}
              next={loadMoreData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              {chunkedContentList.length > 0 ? (
                chunkedContentList.map((chunk, index) => (
                  <div key={index} className={styles.itemBox}>
                    {Array.isArray(chunk) &&
                      chunk.length > 0 &&
                      chunk.map((item) => {
                        if (!item) return null;

                        return (
                          <div
                            className={styles.item}
                            key={item.PRODUCT_SEQ} // 데이터 속성에 맞게 수정
                            onClick={() =>
                              navi(`/products/${item.PRODUCT_SEQ}`)
                            }
                          >
                            <div className={styles.img}>
                              <img src={item.PRODUCT_THUMBNAIL} alt="img" />
                            </div>
                            <div className={styles.title}>
                              <div>
                                {item.PRODUCT_TITLE.length > 20
                                  ? `${item.PRODUCT_TITLE.slice(0, 20)}...`
                                  : item.PRODUCT_TITLE}
                              </div>
                              <div>{addCommas(item.PRICE || 0)}</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))
              ) : (
                <h4>상품 준비중입니다.</h4>
              )}
            </InfiniteScroll>
          </div>
        </div>
      </div>
      <ScrollTop />
    </div>
  );
};
