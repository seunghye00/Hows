import styles from './Category.module.css'
import allComunity from '../../../../../../assets/images/comuni01.png'
import comuni02 from '../../../../../../assets/images/comuni02.png'
import comuni03 from '../../../../../../assets/images/comuni03.png'
import comuni04 from '../../../../../../assets/images/comuni04.png'
import comuni05 from '../../../../../../assets/images/comuni05.png'
import comuni06 from '../../../../../../assets/images/comuni06.png'
import { useNavigate } from 'react-router-dom'

export const Category = () => {
    const navigate = useNavigate()

    // 카테고리 데이터 (이미지와 텍스트)
    const categories = [
        {
            id: 0,
            imageUrl: allComunity,
            name: '전체 커뮤니티',
            path: '/communities',
        }, // 기본 커뮤니티로 돌아가는 버튼
        { id: 1, imageUrl: comuni02, name: '급상승 인기글', sort: 'likes' },
        { id: 2, imageUrl: comuni03, name: '방꾸', keyword: '방꾸' }, // 좋아요 순 정렬
        { id: 3, imageUrl: comuni04, name: '자취생 필수탬', keyword: '자취' },
        { id: 4, imageUrl: comuni05, name: '캠핑 용품 자랑', keyword: '캠핑' },
        {
            id: 5,
            imageUrl: comuni06,
            name: '주방 디자인',
            keyword: '주방',
        },
    ]

    // 카테고리 클릭 핸들러
    const handleCategoryClick = category => {
        if (category.path) {
            navigate(category.path) // 기본 커뮤니티로 이동
        } else if (category.sort) {
            navigate(`/communities/sorted?sort=${category.sort}`)
        } else if (category.keyword) {
            navigate(`/communities/search?keyword=${category.keyword}`) // keyword 파라미터로 넘김
        }
    }

    return (
        <div className={styles.categoryWrap}>
            <div className={styles.categoryTit}>카테고리</div>
            <div className={styles.categoryCont}>
                {categories.map(category => (
                    <div
                        key={category.id}
                        className={styles.categoryItem}
                        onClick={() => handleCategoryClick(category)} // 클릭 이벤트 추가
                    >
                        <img
                            src={category.imageUrl}
                            alt={category.name}
                            className={styles.categoryImage}
                        />
                        <p>{category.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
