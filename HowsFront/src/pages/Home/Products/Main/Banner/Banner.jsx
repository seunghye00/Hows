import styles from './Banner.module.css'
import img from '../../../../../assets/images/banner01.png'
import img1 from '../../../../../assets/images/banner02.png'
import img2 from '../../../../../assets/images/banner03.png'
import { useEffect, useState } from 'react';

export const Banner = () => {
    const images = [
        img,
        img1,
        img2
];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // 3초마다 슬라이드 변경
  
      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, []);
  
    return (
        <div className={styles.container}>
                <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="slide-image" />
        </div>
    );
  
}