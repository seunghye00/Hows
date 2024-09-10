import styles from './AddProduct.module.css'
import { Button } from '../../../../../components/Button/Button'
import { BiCamera } from 'react-icons/bi'
import { categoryList } from '../../../../../api/product'
import { useEffect, useState } from 'react'
import { Editor, EditorComp } from '../../../../../components/Editor/Editor'

export const AddProduct = () => {
    const [categories, setCategories] = useState([]) // 카테고리 목록
    const [selectedCategory, setSelectedCategory] = useState('') // 선택된 카테고리

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 카테고리 목록을 비동기 호출
        categoryList()
            .then(resp => {
                setCategories(resp.data)
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error) // 데이터 가져오기 실패 시 에러 로그 출력
            })
    }, []) // 빈 배열을 의존성으로 설정하여 컴포넌트 마운트 시 한 번만 실행

    // 카테고리 선택 변경 핸들러
    const handleChangeCategory = e => {
        setSelectedCategory(e.target.value) // 선택된 카테고리를 상태에 설정
    }

    return (
        <>
            <div className={styles.btns}>
                <Button size={'s'} title={'완료'} />{' '}
                <Button size={'s'} title={'취소'} />
            </div>
            <div className={styles.container}>
                <div className={styles.imgs}>
                    <span className={styles.addBtn}>
                        <input type="file" name="" id="image" />
                        <label htmlFor="image">
                            <BiCamera size={40} />
                        </label>
                        <div className={styles.imgNum}>
                            <span>2</span> / 10
                        </div>
                    </span>
                    <div className={styles.addedImg}>
                        <button className={styles.delBtn}>&times;</button>
                    </div>
                </div>
                <div className={styles.info}>
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
                    <input type="text" placeholder="상품명을 입력해주세요" />
                    <input
                        type="number"
                        placeholder="상품 금액을 입력해주세요"
                    />
                </div>
                <div className={styles.writeWrap}>
                    <EditorComp />
                </div>
            </div>
        </>
    )
}
