import styles from './Banner.module.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { useEffect, useState } from 'react'
import { bannerList } from '../../../../../api/banner'
import { useNavigate } from 'react-router-dom'

export const Banner = () => {
    const [banners, setBanners] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // 배너 목록 요청
        bannerList().then(resp => {
            const bannerData = resp.data.map(item => {
                return {
                    imageUrl: item.banner_url, // 배너 이미지 URL
                    eventSeq: item.connect_seq, // 이벤트 시퀀스 번호
                }
            })
            setBanners(bannerData)
        })
    }, [])
    // console.log(JSON.stringify(banners));

    // 배너 클릭 시 해당 이벤트 상세 페이지로 이동하는 함수
    const handleBannerClick = eventSeq => {
        if (eventSeq) {
            navigate(`/csservice/event/detail/${eventSeq}`)
        }
    }

    //이미지가 로드되기 전 렌더링 방지
    if (banners.length === 0) {
        return null
    }

    return (
        <div className={styles.container}>
            <Carousel
                showArrows={true}
                centerMode={true}
                centerSlidePercentage={100} // 이미지가 전체 화면에 보이도록 조정
                showThumbs={false} // 썸네일 숨기기
                showStatus={false} // 상태 표시 숨기기
                autoPlay={true} // 자동 재생
                infiniteLoop={true} // 무한 반복
                interval={2000} // 슬라이드 간 시간 (3초)
                stopOnHover={true} // 마우스 오버 시 멈춤
            >
                {banners.map((banner, index) => (
                    <div
                        key={index}
                        onClick={() => handleBannerClick(banner.eventSeq)} // 배너 클릭 시 이벤트 상세 페이지로 이동
                        style={{ cursor: 'pointer' }} // 클릭 가능하도록 커서 스타일 추가
                    >
                        <img
                            src={banner.imageUrl}
                            alt={`Slide ${index + 1}`}
                            className={styles.slideImage}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}
