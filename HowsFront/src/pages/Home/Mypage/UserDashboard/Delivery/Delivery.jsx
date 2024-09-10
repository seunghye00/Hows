import styles from "./Delivery.module.css"
import { Search } from './../../../../../components/Search/Search';
import React, { useState } from 'react'
import { Button } from './../../../../../components/Button/Button';

export const Delivery = () => {
    const [searchResults, setSearchResults] = useState([]) // 검색 결과 상태

    // 게시글 목록 임시 데이터
    const shippingData = [
        {
            shippng_seq: 1,
            orders_seq: '주문번호 1234',
            writer: '민바오',
            date: '2024-08-31',
            reportCount: 1,
            shipping_status: '배송중'
        },
        {
            shippng_seq: 2,
            orders_seq: '주문번호 5678',
            writer: '홍길동',
            date: '2024-09-01',
            reportCount: 2,
            shipping_status: '배송완료'
        },
    ]

    // 검색 기능 구현
    const handleSearch = query => {
        const results = shippingData.filter(
            post => post.orders_seq.includes(query) || post.shipping_status.includes(query)
        )
        setSearchResults(results) // 검색 결과 업데이트
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayShipping = searchResults.length > 0 ? searchResults : shippingData


    return (
        <div className={styles.container}>
            {/* <div className={styles.headerSection}>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="제목 또는 작성자 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div> */}

            <div className={styles.shippinglist}>
                <div className={styles.shippingHeader}>
                    <div className={styles.headerItem}>NO</div>
                    <div className={styles.headerItem}>주문번호</div>
                    <div className={styles.headerItem}>배송현황</div>
                </div>

                {displayShipping.map((item, index) => (
                    <div className={styles.shippingRow} key={index}>
                        <div className={styles.shippingItem}>{item.shippng_seq}</div>
                        <div className={styles.shippingItem}>
                            <span className={styles.span}>{item.orders_seq}</span>
                        </div>
                        <div className={styles.shippingItem}>{item.shipping_status}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}