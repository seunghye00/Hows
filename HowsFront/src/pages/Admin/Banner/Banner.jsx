import styles from './Banner.module.css'
import { Button } from '../../../components/Button/Botton'
import { bannerList } from '../../../api/banner'
import { useEffect, useState } from 'react'
import { formatDate } from '../../../commons/commons'

export const Banner = () => {
    const [banners, setBanners] = useState([])

    useEffect(() => {
        bannerList()
            .then(resp => {
                console.log(resp.data)
                setBanners(resp.data) // 데이터 설정
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error) // 오류 처리
            })
    }, [])

    return (
        <>
            <div className={styles.btns}>
                <Button size={'s'} />
                <Button size={'s'} />
            </div>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.cols}>
                        <input type="checkbox" name="" id="" />
                    </div>
                    <div className={styles.cols}>순서</div>
                    <div className={styles.cols}>이미지</div>
                    <div className={styles.cols}>등록 기간</div>
                </div>
                <div className={styles.list}>
                    {banners.map((banner, i) => (
                        <div key={i} className={styles.rows}>
                            <div className={styles.cols}>
                                <input type="checkbox" name="" id="" />
                            </div>
                            <div className={styles.cols}>
                                {banner.banner_order}
                            </div>
                            <div className={styles.cols}>
                                <img src="{banner.banner_url}" />
                            </div>
                            <div className={styles.cols}>
                                {formatDate(banner.start_date)} ~{' '}
                                {formatDate(banner.end_date)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
