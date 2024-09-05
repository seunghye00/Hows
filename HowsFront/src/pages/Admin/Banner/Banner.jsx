import styles from './Banner.module.css'
import { Button } from '../../../components/Button/Button'
import { bannerList } from '../../../api/banner'
import { useEffect, useState } from 'react'
import { formatDate } from '../../../commons/commons'
import { Modal } from '../../../components/Modal/Modal'

export const Banner = () => {
    const [banners, setBanners] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState('')

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

    // 배너 등록 버튼 클릭
    const handleOpenModal = () => {
        setIsModalOpen(true) // 모달 열기
    }

    // 모달창 닫기 버튼 클릭
    const handleCloseModal = () => {
        setPreview('')
        setIsModalOpen(false) // 모달 닫기
    }

    // 이미지 업로드 버튼 클릭
    const handleFileChange = event => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)

            // 이미지 파일일 경우 미리보기 URL 생성
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
        }
    }

    const handleUpload = () => {
        // 파일 업로드 로직 구현 (예: API 호출)
        console.log('파일 업로드:', selectedFile)
    }

    return (
        <>
            <div className={styles.btns}>
                <Button size={'s'} onClick={handleOpenModal} title={'등록'} />
                <Button size={'s'} title={'삭제'} />
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
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2 className={styles.modalTitle}>메인 배너 등록</h2>
                <div className={styles.imgLabel}>
                    <input
                        id="img"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />
                    <label htmlFor="img">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className={styles.preview}
                            />
                        ) : (
                            <i class="bx bx-camera"></i>
                        )}
                    </label>
                </div>
                <div className={styles.modalBtns}>
                    <Button size={'s'} onClick={handleUpload} title={'완료'} />
                    <Button
                        size={'s'}
                        onClick={handleCloseModal}
                        title={'취소'}
                    />
                </div>
            </Modal>
        </>
    )
}
