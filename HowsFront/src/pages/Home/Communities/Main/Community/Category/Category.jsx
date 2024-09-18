import styles from './Category.module.css'
import img from '../../../../../../assets/images/마이페이지_프로필사진.jpg'
import img1 from '../../../../../../assets/images/꼬래.png'
import img2 from '../../../../../../assets/images/cry.jpg'
import { useNavigate } from 'react-router-dom'

export const Category = () => {
    const navigate = useNavigate()

    // 카테고리 데이터 (이미지와 텍스트)
    const categories = [
        { id: 0, imageUrl: img, name: '전체 커뮤니티', path: '/communities' }, // 기본 커뮤니티로 돌아가는 버튼
        { id: 1, imageUrl: img, name: '자취생 필수탬', keyword: '자취' },
        { id: 2, imageUrl: img1, name: '급상승 인기글', sort: 'likes' }, // 좋아요 순 정렬
        { id: 3, imageUrl: img2, name: '원룸 스타일', keyword: '원룸' },
        { id: 4, imageUrl: img, name: '캠핑 용품 자랑', keyword: '캠핑' },
        {
            id: 5,
            imageUrl: img2,
            name: 'ROTD 오늘의 룸 스타일',
            keyword: 'ROTD',
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
