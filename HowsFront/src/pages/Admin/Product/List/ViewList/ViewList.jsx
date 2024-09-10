import styles from './ViewList.module.css'
import { Search } from '../../../../../components/Search/Search'
import { Button } from '../../../../../components/Button/Button'
import { useEffect, useState } from 'react'
import { categoryList, productList } from '../../../../../api/product'
import { addCommas } from '../../../../../commons/commons'
import { useNavigate } from 'react-router-dom'

export const ViewList = () => {
    // 상태 변수 초기화
    const [products, setProducts] = useState([]) // 전체 상품 목록
    const [filteredProducts, setFilteredProducts] = useState([]) // 필터링된 상품 목록
    const [selectedCategory, setSelectedCategory] = useState('') // 선택된 카테고리
    const [selectAll, setSelectAll] = useState(false) // 전체 선택 상태
    const [categories, setCategories] = useState([]) // 카테고리 목록
    const navi = useNavigate()

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 전체 상품 목록과 카테고리 목록을 비동기 호출
        Promise.all([categoryList(), productList()])
            .then(([categoryData, productData]) => {
                console.log('Categories:', categoryData)
                console.log('Products:', productData)
                setCategories(categoryData.data)
                setProducts(productData.data)
                setFilteredProducts(productData.data) // 처음에는 필터링 없이 전체 상품 목록을 표시
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error) // 데이터 가져오기 실패 시 에러 로그 출력
            })
    }, []) // 빈 배열을 의존성으로 설정하여 컴포넌트 마운트 시 한 번만 실행

    useEffect(() => {
        // 선택된 카테고리에 따라 상품을 필터링
        if (selectedCategory === '') {
            setFilteredProducts(products)
        } else {
            setFilteredProducts(
                products.filter(
                    product => product.category === selectedCategory
                )
            )
        }
    }, [selectedCategory, products]) // selectedCategory 또는 products가 변경될 때마다 실행

    // 카테고리 선택 변경 핸들러
    const handleChangeCategory = e => {
        setSelectedCategory(e.target.value) // 선택된 카테고리를 상태에 설정
    }

    // 전체 선택/해제 핸들러
    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll // 전체 선택 상태를 토글
        setSelectAll(newSelectAll)
        setFilteredProducts(
            filteredProducts.map(product => ({
                ...product,
                checked: newSelectAll, // 전체 선택 상태에 따라 체크 상태 설정
            }))
        )
    }

    // 개별 체크박스 변경 핸들러
    const handleCheckboxChange = productSeq => {
        const updatedProducts = filteredProducts.map(product =>
            product.product_seq === productSeq
                ? { ...product, checked: !product.checked } // 선택된 상품의 체크 상태 토글
                : product
        )
        setFilteredProducts(updatedProducts)

        // 전체 선택 상태를 업데이트
        const allChecked = updatedProducts.every(product => product.checked)
        setSelectAll(allChecked) // 모든 상품이 체크되었는지 확인하고 전체 선택 상태 업데이트
    }

    return (
        <>
            <div className={styles.btns}>
                {/* 카테고리 선택 드롭다운 */}
                <div className={styles.category}>
                    <select
                        value={selectedCategory}
                        onChange={handleChangeCategory}
                    >
                        <option value="">전체</option>
                        {categories.map(category => (
                            <option
                                key={category.product_category_code}
                                value={category.product_category_code}
                            >
                                {category.product_category_title}
                            </option>
                        ))}
                    </select>
                </div>
                <Search /> {/* 검색 컴포넌트 */}
                <Button
                    size={'s'}
                    title={'등록'}
                    onClick={() => navi('/admin/product/addProduct')}
                />{' '}
                {/* 등록 버튼 */}
                <Button size={'s'} title={'삭제'} /> {/* 삭제 버튼 */}
                <Button
                    size={'s'}
                    title={'전체 선택'}
                    onClick={handleSelectAllChange}
                />{' '}
                {/* 전체 선택 버튼 */}
            </div>
            <div className={styles.container}>
                <div
                    className={
                        filteredProducts.length === 0
                            ? styles.empty
                            : styles.listBox
                    }
                >
                    {filteredProducts.length === 0
                        ? '데이터가 없습니다'
                        : filteredProducts.map(product => (
                              <div
                                  key={product.product_seq}
                                  className={styles.cols}
                              >
                                  <img
                                      src={product.product_thumbnail}
                                      alt="대표 이미지"
                                  />
                                  <div className={styles.info}>
                                      <div className={styles.productTitle}>
                                          <input
                                              type="checkbox"
                                              checked={product.checked || false}
                                              onChange={() =>
                                                  handleCheckboxChange(
                                                      product.product_seq
                                                  )
                                              }
                                          />
                                          <div>{product.product_title}</div>
                                      </div>
                                      <div>\ {addCommas(product.price)}</div>
                                  </div>
                              </div>
                          ))}
                </div>
            </div>
        </>
    )
}
