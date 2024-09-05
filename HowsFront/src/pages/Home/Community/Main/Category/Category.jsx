import React from 'react'
import styles from './Category.module.css'
import img from '../../../../../assets/images/마이페이지_프로필사진.jpg'
import img1 from '../../../../../assets/images/꼬래.png'
import img2 from '../../../../../assets/images/cry.jpg'

export const Category = () => {
    // 카테고리 데이터 (이미지와 텍스트)
    const categories = [
        { id: 1, imageUrl: `${img}`, name: '자취생 필수탬' },
        { id: 2, imageUrl: `${img1}`, name: '급상승 인기글' },
        { id: 3, imageUrl: `${img2}`, name: '원룸 스타일' },
        { id: 4, imageUrl: `${img1}`, name: '방꾸 스타일' },
        {
            id: 5,
            imageUrl: `${img}`,
            name: '캠핑 용품 자랑',
        },
        {
            id: 6,
            imageUrl: `${img2}`,
            name: 'ROTD 오늘의 룸 스타일',
        },
    ]

    return (
        <div className={styles.CategoryWrap}>
            {categories.map(category => (
                <div key={category.id} className={styles.CategoryItem}>
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className={styles.CategoryImage}
                    />
                    <p>{category.name}</p>
                </div>
            ))}
        </div>
    )
}
