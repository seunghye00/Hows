import styles from './List.module.css'
import { Search } from '../../../../components/Search/Search'
import { Button } from '../../../../components/Button/Button'
import { useEffect, useState } from 'react'
import {
    categoryList,
    productListByAdmin,
    deleteProducts,
    updateProductByQuantity,
} from '../../../../api/product'
import { addCommas, SwalComp } from '../../../../commons/commons'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'

export const List = () => {
    // 상태 변수 초기화
    const [products, setProducts] = useState([]) // 전체 상품 목록
    const [filteredProducts, setFilteredProducts] = useState([]) // 필터링된 상품 목록
    const [selectedCategory, setSelectedCategory] = useState('') // 선택된 카테고리
    const [selectAll, setSelectAll] = useState(false) // 전체 선택 상태
    const [categories, setCategories] = useState([]) // 카테고리 목록
    const [searchQuery, setSearchQuery] = useState('') // 검색어 상태
    const [quantity, setQuantity] = useState(0) // 수량 상태
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navi = useNavigate()

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 전체 상품 목록과 카테고리 목록을 비동기 호출
        Promise.all([categoryList(), productListByAdmin()])
            .then(([categoryData, productData]) => {
                setCategories(categoryData.data)
                // console.log(productData.data)
                setProducts(productData.data)
                setFilteredProducts(productData.data) // 처음에는 필터링 없이 전체 상품 목록을 표시
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error) // 데이터 가져오기 실패 시 에러 로그 출력
            })
    }, []) // 빈 배열을 의존성으로 설정하여 컴포넌트 마운트 시 한 번만 실행

    useEffect(() => {
        let filtered = products
        if (selectedCategory !== '') {
            filtered = filtered.filter(
                product => product.product_category_code === selectedCategory
            )
        }
        if (searchQuery !== '') {
            filtered = filtered.filter(product =>
                product.product_title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
        }
        setFilteredProducts(filtered)
    }, [selectedCategory, searchQuery]) // 카테고리 or 검색어가 변경될 때마다 실행

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

    // 상품 영역 클릭 핸들러
    const handleProductClick = productSeq => {
        handleCheckboxChange(productSeq)
    }

    // 상품명 검색 핸들러
    const handleSearch = e => {
        setSearchQuery(e)
    }

    // 체크된 상품 삭제 핸들러
    const handleDeleteBanner = () => {
        // 체크된 상품이 존재하는 지 확인
        const selectedProducts = filteredProducts.filter(
            product => product.checked
        )
        if (selectedProducts.length === 0) {
            SwalComp({
                type: 'warning',
                text: '삭제할 상품을 선택해주세요.',
            })
            return
        }

        // 삭제 확인
        SwalComp({
            type: 'question',
            text: '정말로 삭제하시겠습니까?',
        }).then(result => {
            if (result.isConfirmed) {
                // 상품 삭제 요청
                deleteProducts(
                    selectedProducts.map(product => product.product_seq)
                )
                    .then(() => {
                        SwalComp({
                            type: 'success',
                            text: '선택한 상품이 삭제되었습니다.',
                        })
                        // 상품 목록에서 선택된 상품을 제거한 새로운 목록으로 업데이트
                        const updatedProducts = filteredProducts.filter(
                            product => !product.checked
                        )
                        setFilteredProducts(updatedProducts) // products 상태 업데이트
                        // 전체 선택 체크박스를 해제
                        setSelectAll(false)
                    })
                    .catch(error => {
                        SwalComp({
                            type: 'error',
                            text: '상품 삭제에 실패했습니다.',
                        })
                        // 전체 선택 체크박스를 해제
                        setSelectAll(false)
                        setFilteredProducts(
                            filteredProducts.map(product => ({
                                ...product,
                                checked: false,
                            }))
                        )
                        console.error('삭제 실패 :', error)
                    })
            }
        })
    }

    const handleTryModify = () => {
        // 체크된 상품이 존재하는 지 확인
        const selectedProducts = filteredProducts.filter(
            product => product.checked
        )
        if (selectedProducts.length === 0) {
            SwalComp({
                type: 'warning',
                text: '수정할 상품을 선택해주세요.',
            })
            return
        } else if (selectedProducts.length > 1) {
            SwalComp({
                type: 'warning',
                text: '수정할 상품을 한 개만 선택해주세요.',
            })
            return
        }
        navi('/admin/product/modifyProduct', {
            state: selectedProducts[0].product_seq,
        })
    }

    // 수량 변경 버튼 클릭
    const handleOpenModal = () => {
        // 체크된 상품이 존재하는 지 확인
        const selectedProducts = filteredProducts.filter(
            product => product.checked
        )
        if (selectedProducts.length === 0) {
            SwalComp({
                type: 'warning',
                text: '수량 변경할 상품을 선택해주세요.',
            })
            return
        }
        setIsModalOpen(true) // 모달 열기
    }

    // 수량 변경 핸들러
    const handleQuantityChange = e => {
        setQuantity(e.target.value)
    }

    // 모달창 닫기 버튼 클릭
    const handleCloseModal = () => {
        setIsModalOpen(false) // 모달 닫기
    }

    // 상품 수량 변경
    const handleUpdate = () => {
        SwalComp({ type: 'confirm', text: '정말로 변경하시겠습니까 ?' }).then(
            result => {
                if (result.isConfirmed) {
                    // 선택된 항목
                    const selectedProducts = filteredProducts.filter(
                        product => product.checked
                    )
                    // 상품 수량 변경 요청
                    updateProductByQuantity(
                        selectedProducts.map(product => product.product_seq),
                        quantity
                    )
                        .then(() => {
                            SwalComp({
                                type: 'success',
                                text: '선택한 상품의 수량이 변경되었습니다.',
                            })

                            // 수량 변경 후 제품 목록 업데이트
                            const updatedProducts = filteredProducts.map(
                                product => {
                                    // 현재 제품(product)의 product_seq가 선택된 제품 목록(selectedProducts)의 product_seq와 일치하는지 확인
                                    if (
                                        selectedProducts.some(
                                            selected =>
                                                selected.product_seq ===
                                                product.product_seq
                                        )
                                    ) {
                                        // 선택된 제품 목록에 현재 제품이 포함된 경우
                                        return {
                                            ...product, // 기존 제품의 속성을 복사
                                            quantity: quantity, // 수량을 새 값으로 업데이트
                                            checked: !product.checked, // 'checked' 상태를 반전
                                        }
                                    }
                                    // 선택된 제품 목록에 현재 제품이 포함되지 않은 경우
                                    return product // 현재 제품을 변경 없이 그대로 반환
                                }
                            )

                            // 업데이트된 제품 목록을 상태로 설정
                            setFilteredProducts(updatedProducts)
                        })
                        .catch(error => {
                            SwalComp({
                                type: 'error',
                                text: '상품 수량 변경에 실패했습니다.',
                            })
                            console.error('삭제 실패 :', error)
                        })
                    // 전체 선택 체크박스를 해제
                    setSelectAll(false)
                    setFilteredProducts(
                        filteredProducts.map(product => ({
                            ...product,
                            checked: false,
                        }))
                    )
                    setIsModalOpen(false) // 모달 닫기
                }
            }
        )
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
                <Search onSearch={handleSearch} />
                <Button
                    size={'s'}
                    title={'등록'}
                    onClick={() => navi('/admin/product/addProduct')}
                />{' '}
                <Button
                    size={'s'}
                    title={'삭제'}
                    onClick={handleDeleteBanner}
                />
                <Button size={'s'} title={'수정'} onClick={handleTryModify} />
                <Button
                    size={'s'}
                    title={'수량 변경'}
                    onClick={handleOpenModal}
                />
                {selectAll ? (
                    <Button
                        size={'s'}
                        title={'전체 해제'}
                        isChecked={'Y'}
                        onClick={handleSelectAllChange}
                    />
                ) : (
                    <Button
                        size={'s'}
                        title={'전체 선택'}
                        onClick={handleSelectAllChange}
                    />
                )}
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
                                  className={`${styles.cols} ${
                                      product.checked ? styles.checked : ''
                                  }`}
                                  onClick={() =>
                                      handleProductClick(product.product_seq)
                                  }
                              >
                                  <img
                                      src={product.product_thumbnail}
                                      alt="대표 이미지"
                                  />
                                  <div
                                      className={`${styles.info} ${
                                          product.quantity === 0
                                              ? styles.line
                                              : ''
                                      }`}
                                  >
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
                                          <div className={styles.name}>
                                              {product.product_title}
                                          </div>
                                      </div>
                                      <div>\ {addCommas(product.price)}</div>
                                      <div className={styles.num}>
                                          {product.quantity === 0 ? (
                                              <span>품절</span>
                                          ) : (
                                              ''
                                          )}
                                          남은 수량 :{' '}
                                          {addCommas(product.quantity)}개
                                      </div>
                                  </div>
                              </div>
                          ))}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2 className={styles.modalTitle}>상품 수량 변경</h2>
                <div className={styles.quantity}>
                    <input
                        type="number"
                        name="quantity"
                        min={0}
                        placeholder="수량"
                        value={quantity}
                        onChange={handleQuantityChange}
                    />
                </div>
                <div className={styles.modalBtns}>
                    <Button size={'s'} onClick={handleUpdate} title={'완료'} />
                    <Button
                        size={'s'}
                        onClick={handleCloseModal}
                        title={'취소'}
                    />
                </div>
            </Modal>
        </>
    )
}
