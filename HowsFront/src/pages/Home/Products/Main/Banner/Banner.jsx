import styles from './Banner.module.css'
import img from '../../../../../assets/images/banner01.png'
import img1 from '../../../../../assets/images/banner02.png'
import img2 from '../../../../../assets/images/banner03.png'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from 'react';

export const Banner = () => {
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        img,
        img1,
        img2
    ];

    // useEffect(() => {
    //     const interval = setInterval(() => {

    //     // (prevIndex + 1) % images.length는 현재 인덱스 + 1을 이미지 배열의 길이로 나눈 나머지를 반환하여 순환
    //     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

    // }, 3000);

    //   return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    // }, []);


    

    return (
        <div className={styles.container}>
            {/* <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="slide-image" /> */}
            <Carousel
                showArrows={true}
                centerMode={true}
                centerSlidePercentage={100}  // 이미지가 전체 화면에 보이도록 조정
                showThumbs={false}            // 썸네일 숨기기
                showStatus={false}            // 상태 표시 숨기기
                autoPlay={true}               // 자동 재생
                infiniteLoop={true}           // 무한 반복
                interval={3000}               // 슬라이드 간 시간 (3초)
                stopOnHover={true}            // 마우스 오버 시 멈춤
            >
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image} alt={`Slide ${index + 1}`} className={styles.slideImage} />
                    </div>
                ))}
            </Carousel>

        </div>
    );
}