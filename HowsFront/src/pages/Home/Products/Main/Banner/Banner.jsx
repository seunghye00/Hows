import styles from './Banner.module.css'
import img from '../../../../../assets/images/banner01.png'
import img1 from '../../../../../assets/images/banner02.png'
import img2 from '../../../../../assets/images/banner03.png'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from 'react';
import { bannerList } from '../../../../../api/banner'; // 경로는 실제 경로에 맞게 수정

export const Banner = () => {
    
    // const [currentIndex, setCurrentIndex] = useState(0);
    // const images = [
    //     img,
    //     img1,
    //     img2
    // ];

    // useEffect(() => {
    //     const interval = setInterval(() => {

    //     // (prevIndex + 1) % images.length는 현재 인덱스 + 1을 이미지 배열의 길이로 나눈 나머지를 반환하여 순환
    //     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

    // }, 3000);

    //   return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    // }, []);

    const [images, setImages] = useState([]);

    useEffect(() => {
        
        // 배너 목록 요청
        // bannerList().then(resp => {
        //     console.log('1', JSON.stringify(resp));

        //     // URL을 올바른 형식으로 변환
        //     const imageUrls = resp.data.map(item => {
        //         // console.log('원본 URL 확인:', item.banner_url); 
        //         // let updatedUrl = item.banner_url.replace('https://storage.google.com/', 'https://storage.googleapis.com/');
        //         // console.log('변환된 URL 확인:', updatedUrl); 
        //         let updatedUrl = `https://storage.googleapis.com/eunmi-exam-attachment/2f8563bf-afbc-4d06-81ac-0af54c0aa4ea`;
        //         return updatedUrl;
        //     });
            
        //     setImages(imageUrls); 
        // })
        // .catch(error => {
        //     console.error('error', error);
        // });
        
        
        // 배너 - 임시 내 GCS 접근 
        let imgList = [
            'https://storage.googleapis.com/eunmi-exam-attachment/2f8563bf-afbc-4d06-81ac-0af54c0aa4ea',
            'https://storage.googleapis.com/eunmi-exam-attachment/363b2269-3fb8-4fa2-8c1a-803fb6e0831d'
        ];
        
        setImages(imgList);
        
    }, []);
    // console.log("2"+images);


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