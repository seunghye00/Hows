import styles from './Order.module.css'
import { Button } from '../../../../components/Button/Button'
import { Search } from '../../../../components/Search/Search'
import { orderList } from '../../../../api/order'
import { useEffect, useState } from 'react'
import { formatDate, addCommas } from '../../../../commons/commons'
import { Modal } from '../../../../components/Modal/Modal'
import Swal from 'sweetalert2'

export const Order = () => {
    const [orders, setOrders] = useState([])
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
    const [status, setStatus] = useState('product')

    useEffect(() => {
        orderList(status)
            .then(resp => {
                console.log(resp.data)
                const beforeOrders = resp.data.map(order => ({
                    ...order,
                    checked: false, // 초기 체크 상태
                }))
                setOrders(beforeOrders) // 데이터 설정
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error) // 오류 처리
            })
    }, [status])

    // 주문 상태별 목록 조회
    const handleChangeStatus = e => {
        const choice = e.target.getAttribute('data-lable')
        setStatus(choice)
    }

    // 배송 시작 버튼 클릭
    const handleStartDelivery = () => {
        console.log('배송 시작')
    }

    // 주문 목록 클릭
    const handleViewInfo = order_seq => {
        const selectedOrder = orders.find(
            order => order.order_seq === order_seq
        ) // 해당 주문을 찾음
        setViewOrder(selectedOrder) // 객체로 설정
        setIsModalOpen(true) // 모달 열기
    }

    // 모달창 닫기 버튼 클릭
    const handleCloseModal = () => {
        setIsModalOpen(false) // 모달 닫기
    }

    // 전체 선택/해제 핸들러
    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll
        setSelectAll(newSelectAll)
        setOrders(orders.map(order => ({ ...order, checked: !selectAll })))
    }

    // 개별 체크박스 변경 핸들러
    const handleCheckboxChange = orders_seq => {
        const updatedOrders = orders.map(order =>
            order.orders_seq === orders_seq
                ? { ...order, checked: !order.checked }
                : order
        )
        setOrders(updatedOrders)

        // 전체 선택 상태를 업데이트
        const allChecked = updatedOrders.every(order => order.checked)
        setSelectAll(allChecked)
    }

    // 주문명 검색 핸들러
    const handleSearch = e => {
        setSearchQuery(e)
    }

    // 체크된 주문 삭제 핸들러
    const handleDeleteOrder = () => {
        // 체크된 배너가 존재하는 지 확인
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
                // 주문 삭제 요청
                /*
                deleteOrders(selectedOrders.map(order => order.order_seq))
                    .then(() => {
                        Swal.fire({
                            title: '삭제 완료',
                            text: '선택한 배너가 삭제되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인',
                        })
                        setOrders(orders.filter(order => !order.checked))
                        setSelectAll(false)
                    })
                    .catch(error => {
                        Swal.fire({
                            title: '삭제 실패',
                            text: '주문 삭제에 실패했습니다.',
                            icon: 'error',
                            confirmButtonText: '확인',
                        })
                        console.error('삭제 실패 :', error)
                    })
                        */
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
                        data-lable="product"
                        className={status === 'product' ? styles.active : ''}
                    >
                        전체
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-lable="O1"
                        className={status === 'O1' ? styles.active : ''}
                    >
                        입금 대기
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-lable="O2"
                        className={status === 'O2' ? styles.active : ''}
                    >
                        결제 완료
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-lable="O3"
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
                        {orders.length === 0 ? (
                            <div className={styles.empty}>
                                데이터가 없습니다
                            </div>
                        ) : (
                            orders.map((order, i) => (
                                <div key={i} className={styles.rows}>
                                    <div
                                        className={styles.cols}
                                        onClick={() =>
                                            handleCheckboxChange(
                                                order.orders_seq
                                            )
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={order.checked || false}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    order.orders_seq
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
