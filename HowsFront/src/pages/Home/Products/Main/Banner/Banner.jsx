import styles from './Banner.module.css'
import img from '../../../../../assets/images/banner01.png'
import img1 from '../../../../../assets/images/banner02.png'
import img2 from '../../../../../assets/images/banner03.png'
import { useEffect, useState } from 'react';

export const Banner = () => {
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        img,
        img1,
        img2
    ];

    useEffect(() => {
        const interval = setInterval(() => {

        // (prevIndex + 1) % images.length는 현재 인덱스 + 1을 이미지 배열의 길이로 나눈 나머지를 반환하여 순환
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

    }, 3000);

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, []);

    return (
        <div className={styles.container}>
            <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="slide-image" />
        </div>
    );
}