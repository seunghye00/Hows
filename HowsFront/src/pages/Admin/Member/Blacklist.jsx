import React, { useState, useEffect } from 'react'
import styles from './Blacklist.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import {
    selectBlacklist,
    modifyBlacklist,
    detailMember,
} from '../../../api/member'

export const Blacklist = () => {
    const [blacklistMembers, setBlacklistMembers] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [selectedFilter, setSelectedFilter] = useState('전체')
    const [selectedMember, setSelectedMember] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    // 블랙리스트 데이터를 서버로부터 가져오기
    useEffect(() => {
        const fetchBlacklist = async () => {
            try {
                const response = await selectBlacklist()
                setBlacklistMembers(response.data) // 서버에서 가져온 데이터를 저장
            } catch (error) {
                console.error(
                    '블랙리스트 데이터를 가져오는 중 오류 발생:',
                    error
                )
            }
        }
        fetchBlacklist()
    }, [])

    // 모달 열기 및 회원 상세 조회 API 호출
    const openModal = member_id => {
        detailMember(member_id)
            .then(resp => {
                setSelectedMember(resp.data)
                setModalOpen(true)
            })
            .catch(error => console.error('회원 상세 조회 실패:', error))
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedMember(null)
    }

    // 블랙리스트 해제 함수
    const updateBlacklist = async id => {
        const isConfirmed = window.confirm('블랙리스트를 해제시키겠습니까?')

        if (isConfirmed) {
            try {
                await modifyBlacklist({ member_id: id })
                const updatedList = blacklistMembers.filter(
                    member => member.member_id !== id
                )
                setBlacklistMembers(updatedList)
                setSearchResults(updatedList)
            } catch (error) {
                console.error('블랙리스트 해제 중 오류 발생:', error)
            }
        }
    }

    // 검색 기능 구현
    const handleSearch = query => {
        const results = blacklistMembers.filter(
            member =>
                member.name.includes(query) || member.member_id.includes(query)
        )
        setSearchResults(results)
    }

    const handleFilterClick = filter => {
        setSelectedFilter(filter)
        // 필터 클릭 시 처리할 로직 추가 가능
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
                        <div
                            className={styles.memberRow}
                            key={index}
                            onClick={() => openModal(member.member_id)}
                        >
                            <div className={styles.memberItem}>
                                {member.name}
                            </div>
                            <div className={styles.memberItem}>
                                {member.member_id}
                            </div>
                            <div className={styles.memberItem}>
                                {member.blacklist_reason_code}
                            </div>
                            <div className={styles.memberItem}>
                                {member.blacklist_date}
                            </div>
                            <div className={styles.memberItem}>
                                <Button
                                    size="s"
                                    title="해제"
                                    onClick={e => {
                                        e.stopPropagation() // 모달과 충돌 방지
                                        updateBlacklist(member.member_id)
                                    }}
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

            {/* 상세 모달 */}
            {modalOpen && selectedMember && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.profile}>
                            <img
                                src={
                                    selectedMember.profileImageUrl ||
                                    '/default.png'
                                }
                                alt="프로필 이미지"
                            />
                        </div>
                        <div className={styles.info}>
                            <div className={styles.infoItem}>
                                <label>ID</label>
                                <input
                                    type="text"
                                    value={selectedMember.member_id}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>이름</label>
                                <input
                                    type="text"
                                    value={selectedMember.name}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>닉네임</label>
                                <input
                                    type="text"
                                    value={selectedMember.nickname}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>생년월일</label>
                                <input
                                    type="text"
                                    value={selectedMember.birth}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>전화번호</label>
                                <input
                                    type="text"
                                    value={selectedMember.phone}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>이메일</label>
                                <input
                                    type="text"
                                    value={selectedMember.email}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>주소</label>
                                <input
                                    type="text"
                                    value={selectedMember.address}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>상세주소</label>
                                <input
                                    type="text"
                                    value={selectedMember.detail_address}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>가입날짜</label>
                                <input
                                    type="text"
                                    value={selectedMember.signup_date}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>탈퇴날짜</label>
                                <input
                                    type="text"
                                    value={
                                        selectedMember.withdrawal_date || ' '
                                    }
                                    readOnly
                                    disabled
                                />
                            </div>
                        </div>

                        <div className={styles.buttons}>
                            <Button
                                size="s"
                                title="닫기"
                                onClick={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Blacklist
