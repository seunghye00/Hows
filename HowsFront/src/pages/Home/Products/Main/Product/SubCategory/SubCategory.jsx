import { useEffect, useState } from 'react'
import styles from './SubCategory.module.css'
import axios from 'axios'
import { host } from '../../../../../../config/config'
import kitchen from '../../../../../../assets/images/kitchen.png'
import lighting from '../../../../../../assets/images/lighting.png'
import digital from '../../../../../../assets/images/digital.png'
import furniture from '../../../../../../assets/images/furniture.png'
import fabric from '../../../../../../assets/images/fabric.png'
import acceptance from '../../../../../../assets/images/acceptance.png'
import { useNavigate } from 'react-router-dom'

export const SubCategory = () => {
    const navi = useNavigate();

    // 임시 이미지
    const images = [furniture, lighting, fabric, acceptance, digital, kitchen]

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
