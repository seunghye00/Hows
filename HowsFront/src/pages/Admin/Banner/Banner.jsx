import styles from './Banner.module.css'
import { Button } from '../../../components/Button/Button'
import { bannerList, addBanner, deleteBanners } from '../../../api/banner'
import { useEffect, useState } from 'react'
import { formatDate } from '../../../commons/commons'
import { Modal } from '../../../components/Modal/Modal'
import { BiCamera } from 'react-icons/bi'
import Swal from 'sweetalert2'

export const Banner = () => {
    const [banners, setBanners] = useState([])
    const [banner, setBanner] = useState({
        startDate: '',
        endDate: '',
        banner_order: 0,
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [selectAll, setSelectAll] = useState(false)

    useEffect(() => {
        bannerList()
            .then(resp => {
                console.log(resp.data)
                const beforBanners = resp.data.map(banner => ({
                    ...banner,
                    checked: false, // 초기 체크 상태
                }))
                setBanners(beforBanners) // 데이터 설정
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
        setSelectedFile(null)
        setPreview('')
        setIsModalOpen(false) // 모달 닫기
    }

    // 이미지 업로드 버튼 클릭
    const handleFileChange = e => {
        const file = e.target.files[0]
        if (file) {
            // 이미지 파일인지 확인
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    title: '경고 !',
                    text: '이미지 파일만 선택 가능합니다.',
                    icon: 'warning',
                    confirmButtonText: '확인',
                })
                return
            }

            setSelectedFile(file)

            // 이미지 파일일 경우 미리보기 URL 생성
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)

            // 컴포넌트 언마운트 시 URL 해제
            return () => URL.revokeObjectURL(objectUrl)
        }
    }

    const handleChangeBanner = e => {
        const { name, value } = e.target
        console.log(name, value)
        setBanner(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUpload = () => {
        // 이미지 파일이 존재하는 지 확인
        if (!selectedFile) {
            Swal.fire({
                title: '경고 !',
                text: '이미지 파일을 먼저 선택해주세요.',
                icon: 'warning',
                confirmButtonText: '확인',
            })
            return
        }

        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('startDate', banner.startDate)
        formData.append('endDate', banner.endDate)
        formData.append('banner_order', banner.banner_order)

        addBanner(formData)
            .then(resp => {
                console.log('업로드 성공 :', resp.data)
                bannerList().then(resp => {
                    const updatedBanners = resp.data.map(banner => ({
                        ...banner,
                        checked: false,
                    }))
                    setBanners(updatedBanners)
                })
                Swal.fire({
                    title: '업로드 완료',
                    text: '선택한 배너가 업로드되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                })
                handleCloseModal()
            })
            .catch(error => {
                console.error('업로드 실패 :', error)
                Swal.fire({
                    title: '업로드 실패',
                    text: '배너 업로드에 실패했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인',
                })

                handleCloseModal()
            })
    }

    // 전체 선택/해제 핸들러
    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll
        setSelectAll(newSelectAll)
        setBanners(banners.map(banner => ({ ...banner, checked: !selectAll })))
    }

    // 개별 체크박스 변경 핸들러
    const handleCheckboxChange = banner_seq => {
        const updatedBanners = banners.map(banner =>
            banner.banner_seq === banner_seq
                ? { ...banner, checked: !banner.checked }
                : banner
        )
        setBanners(updatedBanners)

        // 전체 선택 상태를 업데이트
        const allChecked = updatedBanners.every(banner => banner.checked)
        setSelectAll(allChecked)
    }

    // 체크된 배너 삭제 핸들러
    const handleDeleteBanner = () => {
        // 체크된 배너가 존재하는 지 확인
        const selectedBanners = banners.filter(banner => banner.checked)
        if (selectedBanners.length === 0) {
            Swal.fire({
                title: '경고 !',
                text: '삭제할 배너를 선택해주세요.',
                icon: 'warning',
                confirmButtonText: '확인',
            })
            return
        }

        // 삭제 확인
        Swal.fire({
            title: '삭제 확인',
            text: '정말로 삭제하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                // 배너 삭제 요청
                deleteBanners(selectedBanners.map(banner => banner.banner_seq))
                    .then(() => {
                        Swal.fire({
                            title: '삭제 완료',
                            text: '선택한 배너가 삭제되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인',
                        })
                        setBanners(banners.filter(banner => !banner.checked))
                        setSelectAll(false)
                    })
                    .catch(error => {
                        Swal.fire({
                            title: '삭제 실패',
                            text: '배너 삭제에 실패했습니다.',
                            icon: 'error',
                            confirmButtonText: '확인',
                        })

                        console.error('삭제 실패 :', error)
                    })
            }
        })
    }

    return (
        <>
            <div className={styles.btns}>
                <Button size={'s'} onClick={handleOpenModal} title={'등록'} />
                <Button
                    size={'s'}
                    onClick={handleDeleteBanner}
                    title={'삭제'}
                />
            </div>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.cols}>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                        />
                    </div>
                    <div className={styles.cols}>순서</div>
                    <div className={styles.cols}>이미지</div>
                    <div className={styles.cols}>등록 기간</div>
                </div>
                <div className={styles.list}>
                    {banners.length === 0 ? (
                        <div className={styles.empty}>데이터가 없습니다</div>
                    ) : (
                        banners.map((banner, i) => (
                            <div
                                key={i}
                                className={`${styles.rows} ${
                                    banner.checked ? styles.checked : ''
                                }`}
                                onClick={() =>
                                    handleCheckboxChange(banner.banner_seq)
                                }
                            >
                                <div className={styles.cols}>
                                    <input
                                        type="checkbox"
                                        checked={banner.checked || false}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                banner.banner_seq
                                            )
                                        }
                                    />
                                </div>
                                <div className={styles.cols}>
                                    {banner.banner_order === 0
                                        ? '미정'
                                        : banner.banner_order}
                                </div>
                                <div className={styles.cols}>
                                    <img
                                        src={banner.banner_url}
                                        alt="배너 이미지"
                                    />
                                </div>
                                <div className={styles.cols}>
                                    {formatDate(banner.start_date)} ~{' '}
                                    {formatDate(banner.end_date)}
                                </div>
                            </div>
                        ))
                    )}
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
                            <BiCamera size={40} />
                        )}
                    </label>
                </div>
                <div className={styles.selectInfo}>
                    <div className={styles.choiceDate}>
                        <div>시작일</div>
                        <input
                            type="date"
                            name="startDate"
                            id=""
                            onChange={handleChangeBanner}
                        />
                    </div>
                    <div className={styles.choiceDate}>
                        <div>종료일</div>
                        <input
                            type="date"
                            name="endDate"
                            id=""
                            onChange={handleChangeBanner}
                        />
                    </div>
                    <div className={styles.choiceOrder}>
                        <div>순서</div>
                        <input
                            type="number"
                            name="banner_order"
                            id=""
                            min={1}
                            placeholder="순서"
                            onChange={handleChangeBanner}
                        />
                    </div>
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
