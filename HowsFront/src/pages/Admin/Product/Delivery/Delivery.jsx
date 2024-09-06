import styles from './Delivery.module.css'
import { Button } from '../../../../components/Button/Button'
import { orderList } from '../../../../api/order'
import { useEffect, useState } from 'react'
import { formatDate } from '../../../../commons/commons'
import { Modal } from '../../../../components/Modal/Modal'
import Swal from 'sweetalert2'

export const Delivery = () => {
    const [orders, setOrders] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [selectAll, setSelectAll] = useState(false)
    const [status, setStatus] = useState('delivery')

    useEffect(() => {
        orderList(status)
            .then(resp => {
                // console.log(resp.data)
                const beforOrders = resp.data.map(order => ({
                    ...order,
                    checked: false, // 초기 체크 상태
                }))
                setOrders(beforOrders) // 데이터 설정
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

    // 구매 확정 버튼 클릭
    const handleDoneDelivery = () => {
        console.log('구매 확정')
    }
    /*
    // 모달창 닫기 버튼 클릭
    const handleCloseModal = () => {
        setSelectedFile(null)
        setPreview('')
        setIsModalOpen(false) // 모달 닫기
    }
    */

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
                <Button
                    size={'s'}
                    onClick={handleDoneDelivery}
                    title={'구매 확정'}
                />
                <Button size={'s'} onClick={handleDeleteOrder} title={'삭제'} />
            </div>
            <div className={styles.container}>
                <div className={styles.category}>
                    <span onClick={handleChangeStatus} data-lable="delivery">
                        전체
                    </span>
                    <span onClick={handleChangeStatus} data-lable="O4">
                        배송 중
                    </span>
                    <span onClick={handleChangeStatus} data-lable="O5">
                        배송 완료
                    </span>
                    <span onClick={handleChangeStatus} data-lable="O6">
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
                        {orders.length === 0 ? (
                            <div className={styles.empty}>
                                데이터가 없습니다
                            </div>
                        ) : (
                            orders.map((order, i) => (
                                <div key={i} className={styles.rows}>
                                    <div className={styles.cols}>
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
                                    <div className={styles.cols}>
                                        {order.order_date}
                                    </div>
                                    <div className={styles.cols}>상품명</div>
                                    <div className={styles.cols}>
                                        {order.name}
                                    </div>
                                    <div className={styles.cols}>
                                        {order.order_price}
                                    </div>
                                    <div className={styles.cols}>
                                        {order.order_title}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
