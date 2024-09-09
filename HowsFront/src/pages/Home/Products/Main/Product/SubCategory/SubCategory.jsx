import { useEffect, useState } from 'react'
import styles from './SubCategory.module.css'
import axios from 'axios'
import { host } from '../../../../../../config/config'
import img01 from '../../../../../../assets/images/가구.png'
import img02 from '../../../../../../assets/images/조명.png'
import img03 from '../../../../../../assets/images/패브릭.png'
import img04 from '../../../../../../assets/images/수납.png'
import img05 from '../../../../../../assets/images/주방용품.png'
import img06 from '../../../../../../assets/images/가전.png'
import { useNavigate } from 'react-router-dom'

export const SubCategory = () => {
    const navi = useNavigate();

    // 임시 이미지
    const images = [img01, img02, img03, img04, img05, img06]

    //카테고리 상태
    const [categoriesList, setCategoriesList] = useState([])
    useEffect(() => {
        axios
            .get(`${host}/category`)
            .then(resp => {
                setCategoriesList(resp.data)
            })
            .catch(err => {
                console.error(err)
            })
    }, []) // 컴포넌트가 처음 렌더링될 때 한 번만 실행




    return (
        <div className={styles.container}>
            <div className={styles.title}>카테고리</div>
            <div className={styles.item}>
                {categoriesList.map((item, i) => {
                    return (
                        <div key={i} className={styles.categoryItem} onClick={()=> navi(`/products/category?code=${item.product_category_code}`)}>
                            <div>
                                <img
                                    src={images[i]}
                                    alt={`category-${i}`}
                                    className={styles.image}
                                />
                            </div>
                            <div>{item.product_category_title}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
