import React, { useState } from 'react'
import styles from './Blacklist.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'

export const Blacklist = () => {
    const [blacklistMembers, setBlacklistMembers] = useState([
        {
            name: '민바오',
            id: 'user1234',
            reason: '욕설 및 비방',
            date: '2024-08-31',
        },
        {
            name: '홍길동',
            id: 'user5678',
            reason: '스팸 및 광고',
            date: '2024-07-15',
        },
    ])

    const [searchResults, setSearchResults] = useState([])
    const [selectedFilter, setSelectedFilter] = useState('전체')

    // 블랙리스트 해제 함수
    const removeFromBlacklist = id => {
        const updatedList = blacklistMembers.filter(member => member.id !== id)
        setBlacklistMembers(updatedList)
        setSearchResults(updatedList)
    }

    // 검색 기능 구현
    const handleSearch = query => {
        const results = blacklistMembers.filter(
            member => member.name.includes(query) || member.id.includes(query)
        )
        setSearchResults(results)
    }

    const handleFilterClick = filter => {
        setSelectedFilter(filter)
        // 필터 클릭 시 처리할 로직 추가 가능 (예: 필터에 맞는 회원 검색 등)
    }

    // 검색 결과가 있으면 그 결과를, 없으면 전체 리스트를 보여줌
    const displayMembers =
        searchResults.length > 0 ? searchResults : blacklistMembers

    return (
        <div className={styles.memberContainer}>
            <div className={styles.headerSection}>
                <div className={styles.filter}>
                    {[
                        '전체',
                        'ㄱ',
                        'ㄴ',
                        'ㄷ',
                        'ㄹ',
                        'ㅁ',
                        'ㅂ',
                        'ㅅ',
                        'ㅇ',
                        'ㅈ',
                        'ㅊ',
                        'ㅋ',
                        'ㅌ',
                        'ㅍ',
                        'ㅎ',
                    ].map((filter, index) => (
                        <span
                            key={index}
                            className={`${styles.filterItem} ${
                                selectedFilter === filter ? styles.selected : ''
                            }`}
                            onClick={() => handleFilterClick(filter)}
                        >
                            {filter}
                        </span>
                    ))}
                </div>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="아이디 또는 이름 검색"
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.memberlist}>
                <div className={styles.memberHeader}>
                    <div className={styles.headerItem}>이름</div>
                    <div className={styles.headerItem}>아이디</div>
                    <div className={styles.headerItem}>블랙리스트 사유</div>
                    <div className={styles.headerItem}>등록 날짜</div>
                    <div className={styles.headerItem}>해제</div>
                </div>

                {displayMembers.length > 0 ? (
                    displayMembers.map((member, index) => (
                        <div className={styles.memberRow} key={index}>
                            <div className={styles.memberItem}>
                                {member.name}
                            </div>
                            <div className={styles.memberItem}>{member.id}</div>
                            <div className={styles.memberItem}>
                                {member.reason}
                            </div>
                            <div className={styles.memberItem}>
                                {member.date}
                            </div>
                            <div className={styles.memberItem}>
                                <Button
                                    size="s"
                                    title="해제"
                                    onClick={() =>
                                        removeFromBlacklist(member.id)
                                    }
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noResult}>검색 결과가 없습니다.</div>
                )}
            </div>

            <div className={styles.pagination}>
                <Paging />
            </div>
        </div>
    )
}

export default Blacklist
