import styles from './Delivery.module.css'
import { Button } from '../../../../components/Button/Button'
import { Search } from '../../../../components/Search/Search'
import { orderList, updateOrder } from '../../../../api/order'
import { useEffect, useState } from 'react'
import { formatDate, addCommas, SwalComp } from '../../../../commons/commons'
import { Modal } from '../../../../components/Modal/Modal'
import Swal from 'sweetalert2'

export const Delivery = () => {
    const [orders, setOrders] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filteredOrders, setFilteredOrders] = useState([]) // 필터링된 주문 목록
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [viewOrder, setViewOrder] = useState({
        order_date: '',
        payment_price: '',
        order_name: '',
        order_price: 0,
        payment_price: 0,
        grade_title: '',
        order_title: '',
        name: '',
    })
    const [selectAll, setSelectAll] = useState(false)
    const [searchQuery, setSearchQuery] = useState('') // 검색어 상태
    const [status, setStatus] = useState('delivery')

    useEffect(() => {
        orderList(status)
            .then(resp => {
                // console.log(resp.data)
                const beforeOrders = resp.data.map(order => ({
                    ...order,
                    checked: false, // 초기 체크 상태
                }))
                setOrders(beforeOrders) // 데이터 설정
                setFilteredOrders(beforeOrders) // 초기에는 전체 주문 목록을 필터링 목록으로 설정
            })
            .catch(error => {
                console.log('데이터 가져오기 실패: ' + error) // 오류 처리
            })
    }, [])

    // 주문 목록 필터링 useEffect
    useEffect(() => {
        const filtered = orders.filter(
            order => status === 'delivery' || order.order_code === status
        )
        setFilteredOrders(filtered)
    }, [status, orders]) // orders 상태가 변경될 때마다 필터링

    // 3. 검색어 변경될 때 검색어를 포함하는 주문 목록 필터링
    useEffect(() => {
        const filtered = orders.filter(order =>
            order.order_name.includes(searchQuery)
        )
        setFilteredOrders(filtered) // 검색어에 따라 필터링된 목록 설정
    }, [searchQuery, orders]) // searchQuery나 orders가 변경될 때마다 실행

    // 주문 목록의 상태 선택 핸들러
    const handleSelectStatus = e => {
        const choice = e.target.getAttribute('data-label')
        setStatus(choice) // 선택된 상태로 변경
    }

    // 주문 상태 변경 핸들러
    const handleChangeStatus = (e, order_seq) => {
        const order_code = e.target.value
        updateOrder(order_seq, order_code)
            .then(resp => {
                console.log(resp)
                console.log(resp)
                // 상태 업데이트만 수행하고 필터링은 useEffect에서 처리
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.order_seq === order_seq
                            ? { ...order, order_code: order_code } // 상태 변경
                            : order
                    )
                )
                SwalComp({
                    type: 'success',
                    text: '주문 상태를 성공적으로 변경했습니다.',
                })
            })
            .catch(error => {
                console.log(error)
                SwalComp({
                    type: 'error',
                    text: '주문 상태 변경에 실패했습니다.',
                })
            })
    }

    // 구매 확정 버튼 클릭
    const handleDoneDelivery = () => {
        console.log('구매 확정')
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
                    onClick={handleDoneDelivery}
                    title={'구매 확정'}
                />
                <Button size={'s'} onClick={handleDeleteOrder} title={'삭제'} />
            </div>
            <div className={styles.container}>
                <div className={styles.category}>
                    <span
                        onClick={handleChangeStatus}
                        data-lable="delivery"
                        className={status === 'delivery' ? styles.active : ''}
                    >
                        전체
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-lable="O4"
                        className={status === 'O4' ? styles.active : ''}
                    >
                        배송 중
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-lable="O5"
                        className={status === 'O5' ? styles.active : ''}
                    >
                        배송 완료
                    </span>
                    <span
                        onClick={handleChangeStatus}
                        data-lable="O6"
                        className={status === 'O6' ? styles.active : ''}
                    >
                        구매 확정
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
                        <div className={styles.cols}>상품명</div>
                        <div className={styles.cols}>주문자</div>
                        <div className={styles.cols}>주문 금액</div>
                        <div className={styles.cols}>배송 현황</div>
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
                                    <div className={styles.cols}>
                                        <select
                                            value={order.order_code} // 현재 주문 상태를 기본 값으로 설정
                                            onChange={
                                                e =>
                                                    handleChangeStatus(
                                                        e,
                                                        order.order_seq
                                                    ) // e와 order_seq를 함께 전달
                                            }
                                        >
                                            <option value="O4">배송 중</option>
                                            <option value="O5">
                                                배송 완료
                                            </option>
                                        </select>
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
                <div className={styles.orderInfo}>
                    <div className={styles.name}>
                        <div className={styles.subTitle}>주문명</div>
                        <div>{viewOrder.order_name}</div>
                    </div>
                    <div className={styles.price}>
                        <div className={styles.subTitle}>주문 금액</div>
                        <div>{addCommas(viewOrder.order_price)}원</div>
                    </div>
                    <div className={styles.price}>
                        <div className={styles.subTitle}>결재 금액</div>
                        <div>{addCommas(viewOrder.payment_price)}원</div>
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
                    <div className={styles.member}>
                        <div className={styles.subTitle}>전화 번호</div>
                        <div>{viewOrder.orderer_phone}</div>
                    </div>
                </div>
                <div className={styles.addressInfo}>
                    <div className={styles.subTitle}>배송지</div>
                    <div>
                        {viewOrder.orderer_zip_code} <br />
                        {viewOrder.orderer_address}
                        {'  '}
                        {viewOrder.orderer_detail_address}
                    </div>
                </div>
            </Modal>
        </>
    )
}
