import styles from './Banner.module.css'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from 'react';
import { bannerList } from '../../../../../api/banner';

export const Banner = () => {

    const [images, setImages] = useState([]);

    useEffect(() => {
        // 배너 목록 요청
        bannerList().then(resp => {
                const imageUrls = resp.data.map(item => {
                    let updatedUrl = item.banner_url.replace('https://storage.google.com/', 'https://storage.googleapis.com/');
                    console.log(images)
                    return updatedUrl;
                });
                
                setImages(imageUrls); 
                console.log(images)
            })
            .catch(error => {console.error('error', error);});
    
    }, []);

    //이미지가 로드되기 전 렌더링 방지
    if(images.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Carousel
                showArrows={true}
                centerMode={true}
                centerSlidePercentage={100}  // 이미지가 전체 화면에 보이도록 조정
                showThumbs={false}            // 썸네일 숨기기
                showStatus={false}            // 상태 표시 숨기기
                autoPlay={true}               // 자동 재생
                infiniteLoop={true}           // 무한 반복
                interval={2000}               // 슬라이드 간 시간 (3초)
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