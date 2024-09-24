import styles from './Banner.module.css'
import { Button } from '../../../components/Button/Button'
import {
    bannerListByAdmin,
    addBanner,
    deleteBanners,
    updateBanner,
} from '../../../api/banner'
import { useEffect, useState } from 'react'
import {
    formatDate,
    formatDateForInput,
    SwalComp,
} from '../../../commons/commons'
import { Modal } from '../../../components/Modal/Modal'
import { BiCamera } from 'react-icons/bi'
import { selectEvt } from '../../../api/event'
import { Paging } from '../../../components/Pagination/Paging'

export const Banner = () => {
    const [banners, setBanners] = useState([])
    const [banner, setBanner] = useState({
        startDate: '',
        endDate: '',
        banner_order: 0,
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubModalOpen, setIsSubModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [selectAll, setSelectAll] = useState(false)
    const [events, setEvents] = useState([]) // 이벤트 목록 저장
    const [totalEvts, setTotalEvts] = useState(0) // 전체 이벤트 수
    const [page, setPage] = useState(1) // 현재 페이지 상태
    const [itemsPerPage] = useState(10) // 페이지당 항목 수
    const [selectedEvent, setSelectedEvent] = useState(null) // 선택한 이벤트

    // 오늘 날짜 가져오기
    const today = new Date()

    // 내일 날짜 설정
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    // 페이징에 따른 startRow와 endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    useEffect(() => {
        bannerListByAdmin()
            .then(resp => {
                // console.log(resp.data)
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

    // 이벤트 목록 가져오기 (useEffect 사용)
    useEffect(() => {
        loadEvents()
    }, [page])

    const loadEvents = async () => {
        try {
            console.log(
                `현재 페이지: ${page}, 시작 행: ${startRow}, 끝 행: ${endRow}, 페이지당 항목 수: ${itemsPerPage}`
            )

            // 서버에 startRow와 endRow를 넘겨서 데이터를 받아옴
            const response = await selectEvt(startRow, endRow)

            // 서버 응답 데이터 확인
            console.log('서버에서 받은 데이터:', response.data)

            // 서버에서 받은 이벤트 목록과 전체 이벤트 수를 상태에 저장
            const { eventList, totalEvents } = response.data
            console.log(
                '이벤트 목록:',
                eventList,
                '전체 이벤트 수:',
                totalEvents
            )

            // 서버에서 받은 이벤트 목록을 상태에 저장
            setEvents(eventList)
            // 전체 이벤트 수 저장 (페이징을 위한 값)
            setTotalEvts(totalEvents)
        } catch (error) {
            console.error('이벤트 목록을 불러오는데 실패했습니다.', error)
        }
    }

    // 페이지 변경 처리
    const handlePageChange = pageNumber => {
        setPage(pageNumber) // 페이지 상태 업데이트
    }

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
                SwalComp({
                    type: 'warning',
                    text: '이미지 파일만 선택 가능합니다.',
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
        setBanner(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUpload = () => {
        // 이미지 파일이 존재하는 지 확인
        if (!selectedFile) {
            SwalComp({
                type: 'warning',
                text: '이미지 파일을 먼저 선택해주세요.',
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
                // console.log('업로드 성공 :', resp.data)
                bannerListByAdmin().then(resp => {
                    const updatedBanners = resp.data.map(banner => ({
                        ...banner,
                        checked: false,
                    }))
                    setBanners(updatedBanners)
                })
                SwalComp({
                    type: 'success',
                    text: '선택한 배너가 업로드되었습니다.',
                })
                handleCloseModal()
            })
            .catch(error => {
                console.error('업로드 실패 :', error)
                SwalComp({
                    type: 'error',
                    text: '배너 업로드에 실패했습니다.',
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
            SwalComp({
                type: 'warning',
                text: '삭제할 배너를 선택해주세요.',
            })
            return
        }

        // 삭제 확인
        SwalComp({
            type: 'question',
            text: '정말로 삭제하시겠습니까?',
        }).then(result => {
            if (result.isConfirmed) {
                // 배너 삭제 요청
                deleteBanners(selectedBanners.map(banner => banner.banner_seq))
                    .then(() => {
                        SwalComp({
                            type: 'success',
                            text: '선택한 배너가 삭제되었습니다.',
                        })
                        setBanners(banners.filter(banner => !banner.checked))
                        setSelectAll(false)
                    })
                    .catch(error => {
                        SwalComp({
                            type: 'error',
                            text: '배너 삭제에 실패했습니다.',
                        })
                        console.error('삭제 실패 :', error)
                    })
            }
        })
    }

    // 배너 연결 버튼 클릭
    const handleOpenSubModal = () => {
        // 체크된 배너가 존재하는 지 확인
        const selectedBanners = banners.filter(banner => banner.checked)

        if (selectedBanners.length !== 1) {
            SwalComp({
                type: 'warning',
                text: '배너를 한 개만 선택해주세요',
            })
            return
        }

        setIsSubModalOpen(true) // 모달 열기
    }

    // 모달창 닫기 버튼 클릭
    const handleCloseSubModal = () => {
        setIsSubModalOpen(false) // 모달 닫기
    }

    // 체크된 배너와 체크된 이벤트 연결 핸들러
    const handleConnectEvent = () => {
        // 선택 확인
        SwalComp({
            type: 'question',
            text: '해당 이벤트를 연결하시겠습니까 ?',
        }).then(result => {
            if (result.isConfirmed) {
                // 체크된 배너 정보 저장
                const selectedBanner = banners.filter(banner => banner.checked)
                updateBanner(selectedBanner[0].banner_seq, selectedEvent)
                    .then(resp => {
                        if (resp.data) {
                            SwalComp({
                                type: 'success',
                                text: '성공적으로 연결했습니다.',
                            })
                        } else {
                            SwalComp({
                                type: 'error',
                                text: '연결에 실패했습니다.',
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        SwalComp({
                            type: 'error',
                            text: '연결에 실패했습니다.',
                        })
                    })
            }
        })
        setSelectedEvent(null)
        setIsSubModalOpen(false)
        setBanners(banners.map(banner => ({ ...banner, checked: false })))
    }

    const handleCheckEvent = event_seq => {
        setSelectedEvent(event_seq)
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
                <Button
                    size={'s'}
                    onClick={handleOpenSubModal}
                    title={'연결'}
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
                                    {banner.start_date} ~ {banner.end_date}
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
                            min={formatDateForInput(tomorrow)}
                            max={banner.endDate === '' ? '' : banner.endDate}
                            onChange={handleChangeBanner}
                        />
                    </div>
                    <div className={styles.choiceDate}>
                        <div>종료일</div>
                        <input
                            type="date"
                            name="endDate"
                            min={
                                banner.startDate === ''
                                    ? formatDateForInput(tomorrow)
                                    : banner.startDate
                            }
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
            <Modal isOpen={isSubModalOpen} onClose={handleCloseSubModal}>
                <h2 className={styles.modalTitle}>등록된 이벤트 목록</h2>
                <div className={styles.eventList}>
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <div
                                className={styles.events}
                                key={event.event_seq}
                                onClick={() =>
                                    handleCheckEvent(event.event_seq)
                                }
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedEvent === event.event_seq}
                                    onChange={() =>
                                        handleCheckEvent(event.event_seq)
                                    }
                                />
                                <div className={styles.eventItem}>
                                    {startRow + index}
                                </div>
                                <div className={styles.eventTitle}>
                                    <span>{event.event_title}</span>
                                </div>
                                <div className={styles.eventItem}>
                                    {formatDate(event.event_date)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.empty}>이벤트가 없습니다</div>
                    )}
                </div>
                {/* 페이징 컴포넌트 */}
                <div className={styles.pagination}>
                    <Paging
                        page={page}
                        count={totalEvts} // 전체 이벤트 개수
                        perpage={itemsPerPage} // 페이지당 항목 수
                        setPage={handlePageChange} // 페이지 변경 함수
                    />
                </div>
                <div className={styles.subModalBtns}>
                    <Button
                        size={'s'}
                        onClick={handleConnectEvent}
                        title={'선택'}
                    />
                    <Button
                        size={'s'}
                        onClick={handleCloseSubModal}
                        title={'취소'}
                    />
                </div>
            </Modal>
        </>
    )
}
