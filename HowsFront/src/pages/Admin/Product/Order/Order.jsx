import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { orderList } from '../../../../api/order'
import { formatDate, addCommas } from '../../../../commons/commons'
import styles from './Order.module.css'
import { Button } from '../../../../components/Button/Button'
import { Search } from '../../../../components/Search/Search'
import { Modal } from '../../../../components/Modal/Modal'

export const Order = () => {
    const [orders, setOrders] = useState([]) // 전체 주문 목록
    const [filteredOrders, setFilteredOrders] = useState([]) // 필터링된 주문 목록
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [viewOrder, setViewOrder] = useState({
        order_date: '',
        payment_price: '',
        order_name: '',
        order_price: 0,
        payment_price: 0,
        grade_title: '',
        name: '',
    })
    const [selectAll, setSelectAll] = useState(false)
    const [searchQuery, setSearchQuery] = useState('') // 검색어 상태
    const [status, setStatus] = useState('product') // 현재 선택된 주문 상태

    // 1. 컴포넌트가 처음 렌더링될 때 API 호출하여 전체 주문 목록 불러옴
    useEffect(() => {
        orderList('status')
            .then(resp => {
                const beforeOrders = resp.data.map(order => ({
                    ...order,
                    checked: false, // 초기 체크 상태
                }))
                setOrders(beforeOrders) // 불러온 주문 목록을 orders에 저장
                setFilteredOrders(beforeOrders) // 초기에는 전체 주문 목록을 필터링 목록으로 설정
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error)
            })
    }, []) // 빈 배열을 종속성으로 두어 최초 한 번만 실행

    // 2. 주문 상태 변경될 때 orders에서 필터링하여 filteredOrders 설정
    useEffect(() => {
        if (status === 'product') {
            setFilteredOrders(orders) // 상태가 '전체'일 경우 모든 주문 목록을 보여줌
        } else {
            setFilteredOrders(
                orders.filter(order => order.order_code === status) // 선택된 상태에 따라 주문 필터링
            )
        }
    }, [status, orders]) // status나 orders가 변경될 때마다 실행

    // 3. 검색어 변경될 때 검색어를 포함하는 주문 목록 필터링
    useEffect(() => {
        const filtered = orders.filter(order =>
            order.order_name.includes(searchQuery)
        )
        setFilteredOrders(filtered) // 검색어에 따라 필터링된 목록 설정
    }, [searchQuery, orders]) // searchQuery나 orders가 변경될 때마다 실행

    // 주문 상태 변경 핸들러
    const handleChangeStatus = e => {
        const choice = e.target.getAttribute('data-label')
        setStatus(choice) // 선택된 상태로 변경
    }

    // 배송 시작 버튼 클릭 핸들러
    const handleStartDelivery = () => {
        console.log('배송 시작')
    }

    // 주문 목록 클릭 시 상세 정보 보기
    const handleViewInfo = order_seq => {
        const selectedOrder = orders.find(
            order => order.order_seq === order_seq
        ) // 해당 주문을 찾음
        setViewOrder(selectedOrder) // 선택된 주문 정보를 설정
        setIsModalOpen(true) // 모달 열기
    }

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false) // 모달 닫기
    }

    // 전체 선택/해제 핸들러
    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll
        setSelectAll(newSelectAll)
        setOrders(orders.map(order => ({ ...order, checked: !selectAll }))) // 전체 선택/해제 상태를 반영
    }

    // 개별 체크박스 변경 핸들러
    const handleCheckboxChange = orders_seq => {
        const updatedOrders = orders.map(order =>
            order.order_seq === orders_seq
                ? { ...order, checked: !order.checked } // 체크 상태 토글
                : order
        )
        setOrders(updatedOrders)

        // 전체 선택 상태를 업데이트
        const allChecked = updatedOrders.every(order => order.checked)
        setSelectAll(allChecked)
    }

    // 검색 핸들러
    const handleSearch = e => {
        setSearchQuery(e)
    }

    // 체크된 주문 삭제 핸들러
    const handleDeleteOrder = () => {
        const selectedOrders = orders.filter(order => order.checked)
        if (selectedOrders.length === 0) {
            Swal.fire({
                title: '경고 !',
                text: '삭제할 주문 선택해주세요.',
                icon: 'warning',
                confirmButtonText: '확인',
            })
            return
        }

        Swal.fire({
            title: '삭제 확인',
            text: '정말로 삭제하시겠습니까?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                // 삭제 로직 추가
            }
        })
    }

    return (
        <>
            <div className={styles.btns}>
                <Search onSearch={handleSearch} />
                <Button
                    size={'s'}
                    onClick={handleStartDelivery}
                    title={'배송 시작'}
                />
                <Button size={'s'} onClick={handleDeleteOrder} title={'삭제'} />
            </div>
            <div className={styles.container}>
                <div className={styles.category}>
                    <span
                        onClick={handleChangeStatus}
                        data-label="product"
                        className={status === 'product' ? styles.active : ''}
                    >
                        전체
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-label="O1"
                        className={status === 'O1' ? styles.active : ''}
                    >
                        입금 대기
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-label="O2"
                        className={status === 'O2' ? styles.active : ''}
                    >
                        결제 완료
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-label="O3"
                        className={status === 'O3' ? styles.active : ''}
                    >
                        배송 준비
                    </span>
                </div>
                <div className={styles.table}>
                    <div className={styles.header}>
                        <div className={styles.cols}>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                        </div>
                        <div className={styles.cols}>주문 일시</div>
                        <div className={styles.cols}>주문명</div>
                        <div className={styles.cols}>주문자</div>
                        <div className={styles.cols}>주문 금액</div>
                        <div className={styles.cols}>주문 상태</div>
                    </div>
                    <div className={styles.listBox}>
                        {filteredOrders.length === 0 ? (
                            <div className={styles.empty}>
                                데이터가 없습니다
                            </div>
                        ) : (
                            filteredOrders.map((order, i) => (
                                <div key={i} className={styles.rows}>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleCheckboxChange(
                                                order.order_seq
                                            )
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={order.checked || false}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    order.order_seq
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        {formatDate(order.order_date)}
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        {order.order_name}
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        {order.name}
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        \ {addCommas(order.order_price)}
                                    </div>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleViewInfo(order.order_seq)
                                        }
                                    >
                                        {order.order_title}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2 className={styles.modalTitle}>주문 상세 정보</h2>
                <div className={styles.dateInfo}>
                    <div className={styles.date}>
                        <div className={styles.subTitle}>주문일</div>
                        <div>{formatDate(viewOrder.order_date)}</div>
                    </div>
                    <div className={styles.date}>
                        <div className={styles.subTitle}>결재일</div>
                        <div>{formatDate(viewOrder.payment_date)}</div>
                    </div>
                </div>
                <div className={styles.orderName}>
                    <div className={styles.subTitle}>주문명</div>
                    <div>{viewOrder.order_name}</div>
                </div>
                <div className={styles.priceInfo}>
                    <div className={styles.price}>
                        <div className={styles.subTitle}>주문 금액</div>
                        <div>{addCommas(viewOrder.order_price)}</div>
                    </div>
                    <div className={styles.price}>
                        <div className={styles.subTitle}>결재 금액</div>
                        <div>{addCommas(viewOrder.payment_price)}</div>
                    </div>
                </div>
                <div className={styles.memberInfo}>
                    <div className={styles.member}>
                        <div className={styles.subTitle}>회원 등급</div>
                        <div>{viewOrder.grade_title}</div>
                    </div>
                    <div className={styles.member}>
                        <div className={styles.subTitle}>회원명</div>
                        <div>{viewOrder.name}</div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
