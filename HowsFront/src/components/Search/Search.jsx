import React, { useState } from 'react'
import styles from './Search.module.css'
import axios from 'axios'

export const Search = ({ placeholder = 'Search...', onSearch, size }) => {
    const [searchValue, setSearchValue] = useState('')

    const handleSearch = () => {
        console.log('Search Value:', searchValue) // 검색어 로그 출력
        if (onSearch) {
            onSearch(searchValue) // 검색 버튼 클릭 시, onSearch 함수를 호출하고 query 값을 전달
        }
        setSearchValue('') // 검색어 입력창 초기화
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleSearch() // 엔터키를 눌렀을 때 검색 동작
        }
    }

    return (
        <div className={`${styles.searchBox} ${styles[size]}`}>
            <input
                type="text"
                value={searchValue}
                placeholder={placeholder} // 사용자 정의 placeholder
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress} // 엔터키 감지
            />
            <button
                className={styles.searchBtn}
                type="button"
                onClick={handleSearch} // 버튼 클릭 시 검색 동작
            >
                <i className="bx bx-search" />
            </button>
        </div>
    )
}
