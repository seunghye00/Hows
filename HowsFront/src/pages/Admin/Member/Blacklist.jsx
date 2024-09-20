import React, { useState, useEffect } from 'react'
import styles from './Blacklist.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import { formatDate } from '../../../commons/commons'
import Swal from 'sweetalert2'
import {
    selectBlacklist,
    modifyBlacklist,
    detailMember,
} from '../../../api/member'

export const Blacklist = () => {
    const [blacklistMembers, setBlacklistMembers] = useState([]) // 기본값을 빈 배열로 설정
    const [searchTerm, setSearchTerm] = useState('') // 검색어 상태 추가
    const [chosung, setChosung] = useState('전체') // 초성 필터 상태 추가
    const [page, setPage] = useState(1) // 현재 페이지 상태
    const [totalMembers, setTotalMembers] = useState(0) // 전체 회원 수 저장
    const itemsPerPage = 10 // 페이지당 보여줄 항목 수
    const [searchResults, setSearchResults] = useState([]) // 검색 결과 상태 추가

    const [selectedMember, setSelectedMember] = useState(null) // 선택된 멤버 상태
    const [modalOpen, setModalOpen] = useState(false) // 모달 상태

    // 페이지에 따른 startRow와 endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    // 블랙리스트 데이터를 서버로부터 가져오기
    useEffect(() => {
        const fetchBlacklist = async () => {
            try {
                const response = await selectBlacklist(
                    startRow,
                    endRow,
                    chosung,
                    searchTerm
                )
                console.log('Fetched blacklist members:', response.data) // 콘솔에서 데이터를 확인
                setBlacklistMembers(response.data.blacklist || []) // 데이터가 없으면 빈 배열을 설정
                setTotalMembers(response.data.totalCount || 0) // 전체 블랙리스트 회원 수 저장
            } catch (error) {
                console.error(
                    '블랙리스트 데이터를 가져오는 중 오류 발생:',
                    error
                )
                setBlacklistMembers([]) // 오류 발생 시 빈 배열을 설정
            }
        }
        fetchBlacklist()
    }, [chosung, searchTerm, page])

    // 검색 기능 처리
    const handleSearch = query => {
        setSearchTerm(query) // 검색어 상태 업데이트
        setChosung('전체')
    }

    // 초성 필터 변경 처리
    const handleFilterClick = filter => {
        setChosung(filter) // 초성 필터 상태 업데이트
    }

    // 페이지 변경 처리
    const handlePageChange = pageNumber => {
        setPage(pageNumber)
    }

    // 모달 열기 및 회원 상세 조회 API 호출
    const openModal = member_id => {
        detailMember(member_id)
            .then(resp => {
                setSelectedMember(resp.data) // 멤버 상세 정보를 저장
                setModalOpen(true) // 모달 열기
            })
            .catch(error => console.error('회원 상세 조회 실패:', error))
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedMember(null)
    }

    // 블랙리스트 해제 함수 (Swal 적용)
    const updateBlacklist = async id => {
        const result = await Swal.fire({
            title: '블랙리스트 해제',
            text: '블랙리스트를 해제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '해제',
            cancelButtonText: '취소',
        })

        if (result.isConfirmed) {
            try {
                await modifyBlacklist({ member_id: id })
                const updatedList = blacklistMembers.filter(
                    member => member.member_id !== id
                )
                setBlacklistMembers(updatedList)
                setSearchResults(updatedList)
                Swal.fire(
                    '해제 완료',
                    '해제가 성공적으로 완료되었습니다.',
                    'success'
                )
            } catch (error) {
                console.error('블랙리스트 해제 중 오류 발생:', error)
                Swal.fire(
                    '해제 실패',
                    '오류가 발생했습니다. 다시 시도해주세요.',
                    'error'
                )
            }
        }
    }

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
                                chosung === filter ? styles.selected : ''
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
                    <div className={styles.headerItem}>등록일시</div>
                    <div className={styles.headerItem}>해제</div>
                </div>

                {blacklistMembers.length > 0 ? (
                    blacklistMembers.map((member, index) => (
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
                                {formatDate(member.blacklist_date)}
                            </div>
                            <div className={styles.memberItem}>
                                <Button
                                    size="s"
                                    title="해제"
                                    onClick={e => {
                                        e.stopPropagation()
                                        updateBlacklist(member.member_id)
                                    }}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>검색 결과가 없습니다.</div>
                )}
            </div>

            {/* 페이지네이션 컴포넌트 */}
            <div className={styles.pagination}>
                <Paging
                    page={page}
                    count={totalMembers}
                    perpage={itemsPerPage}
                    setPage={handlePageChange}
                />
            </div>

            {/* 상세 모달 */}
            {modalOpen && selectedMember && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.profile}>
                            <img
                                src={
                                    selectedMember?.member_avatar ||
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
                                <label>가입일시</label>
                                <input
                                    type="text"
                                    value={formatDate(
                                        selectedMember.signup_date
                                    )}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>탈퇴일시</label>
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
