import styles from './Category.module.css'
import img from '../../../../../assets/images/마이페이지_프로필사진.jpg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from '../../../../../config/config';

export const Category = () => {

  // ===== 가격 버튼 클릭시 나오는 라디오 박스 토글 =====
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('전체');

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSelectedOption('전체'); 
  };
  // ===== 가격 버튼 클릭시 나오는 라디오 박스 토글 =====

  const [categoriesList,setCategoriesList] = useState([]);
  
  useEffect(() => {
    axios.get(`${host}/category`)
      .then((resp) => {
        console.log(JSON.stringify(resp))
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
              <div className={styles.price} onClick={handleToggle}>
                가격
              </div>
              {/* 토글 상태에 따라 라디오 버튼을 포함한 메뉴를 표시 */}
              {isOpen && (
                <div className={styles.dropdown}>
                  <label>
                    <input type="radio" name="priceOption" checked={selectedOption === '전체'} onChange={() => handleSelect('전체')}/>  전체
                  </label>
                  <label>
                    <input type="radio" name="priceOption" checked={selectedOption === '50,000원 이하'} onChange={() => handleSelect('50,000원 이하')}/>  50,000원 이하
                  </label>
                  <label>
                    <input type="radio" name="priceOption" checked={selectedOption === '50,000원 ~ 100,000원'} onChange={() => handleSelect('50,000원 ~ 100,000원')}/>  50,000원 ~ 100,000원
                  </label>
                  <label>
                    <input type="radio" name="priceOption" checked={selectedOption === '100,000원 ~ 200,000원'} onChange={() => handleSelect('100,000원 ~ 200,000원')}/>  100,000원 ~ 200,000원
                  </label>
                  <label>
                    <input type="radio" name="priceOption" checked={selectedOption === '200,000원 ~ 300,000원'} onChange={() => handleSelect('200,000원 ~ 300,000원')}/>  200,000원 ~ 300,000원
                  </label>
                  <label>
                    <input type="radio" name="priceOption" checked={selectedOption === '300,000원 ~ 400,000원'} onChange={() => handleSelect('300,000원 ~ 400,000원')}/>  300,000원 ~ 400,000원
                  </label>
                  <label>
                    <input type="radio" name="priceOption" checked={selectedOption === '400,000원 ~ 500,000원'} onChange={() => handleSelect('400,000원 ~ 500,000원')}/>  400,000원 ~ 500,000원
                  </label>
                  <label>
                    <input type="radio" name="priceOption" checked={selectedOption === '500,000원 이상'} onChange={() => handleSelect('500,000원 이상')}/>  500,000원 이상
                  </label>
                </div>
              )}
              <div className={styles.option}>
                <div>9999999999개</div>
                <div>
                  <select>
                    <option>인기순</option>
                    <option>추천순</option>
                    <option>판매순</option>
                    <option>최신순</option>
                    <option>낮은 가격순</option>
                    <option>높은 가격순</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className={styles.item}>
                <div className={styles.img}><img src={img} alt='img'></img></div>
                <div className={styles.title}>
                  <div>상품명</div>
                  <div>상품가격</div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.img}><img src={img} alt='img'></img></div>
                <div className={styles.title}>
                  <div>상품명</div>
                  <div>상품가격</div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.img}><img src={img} alt='img'></img></div>
                <div className={styles.title}>
                  <div>상품명</div>
                  <div>상품가격</div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.img}><img src={img} alt='img'></img></div>
                <div className={styles.title}>
                  <div>상품명</div>
                  <div>상품가격</div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.img}><img src={img} alt='img'></img></div>
                <div className={styles.title}>
                  <div>상품명</div>
                  <div>상품가격</div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.img}><img src={img} alt='img'></img></div>
                <div className={styles.title}>
                  <div>상품명</div>
                  <div>상품가격</div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.img}><img src={img} alt='img'></img></div>
                <div className={styles.title}>
                  <div>상품명</div>
                  <div>상품가격</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}