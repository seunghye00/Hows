import React, { useState, useEffect } from 'react'
import styles from './Member.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import { formatDate } from '../../../commons/commons'
import Swal from 'sweetalert2'
import {
    selectAll,
    detailMember,
    updateMemberStatus,
    getAllBlacklistReasons,
    getAllGrades,
    getAllRoles,
} from '../../../api/member'

export const Member = () => {
    const [members, setMembers] = useState([])
    const [Modal, setModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [blacklistModal, setBlacklistModal] = useState(false)
    const [selectedMember, setSelectedMember] = useState('')
    const [blacklistReasons, setBlacklistReasons] = useState([])
    const [Grade, setGrade] = useState('')
    const [Role, setRole] = useState('')
    const [grades, setGrades] = useState([])
    const [roles, setRoles] = useState([])
    const [blacklistReason, setBlacklistReason] = useState('')
    const [searchTerm, setSearchTerm] = useState('') // 검색어
    const [chosung, setChosung] = useState('전체') // 초성 필터 상태
    const [page, setPage] = useState(1) // 현재 페이지 상태
    const [totalMembers, setTotalMembers] = useState(0) // 전체 회원 수 저장
    const itemsPerPage = 10 // 페이지당 보여줄 항목 수

    // 페이지에 따른 startRow와 endRow 계산
    const startRow = (page - 1) * itemsPerPage + 1
    const endRow = page * itemsPerPage

    // 회원 목록과 전체 회원 수를 서버에서 가져오는 함수
    const fetchMembers = async () => {
        try {
            const response = await selectAll(
                startRow,
                endRow,
                chosung,
                searchTerm
            )
            setMembers(response.data.members)
            setTotalMembers(response.data.totalCount)
        } catch (error) {
            console.error('전체 회원 조회 실패:', error)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [page, chosung, searchTerm]) // page, chosung, searchTerm 변경 시마다 호출

    // 서버에서 등급 및 역할 정보 가져오기
    useEffect(() => {
        getAllGrades()
            .then(resp => setGrades(resp.data))
            .catch(error => console.error('등급 조회 실패:', error))

        getAllRoles()
            .then(resp => setRoles(resp.data))
            .catch(error => console.error('역할 조회 실패:', error))
    }, [])

    const Modalopen = member_id => {
        detailMember(member_id)
            .then(resp => {
                setSelectedMember(resp.data)
                setModal(true)
                setGrade(resp.data.grade_code || '')
                setRole(resp.data.role_code || '')
            })
            .catch(error => console.error('회원 상세 조회 실패:', error))
    }

    const Modalclose = () => {
        setModal(false)
        setEditMode(false)
        setSelectedMember(null)
    }

    const toggleEditMode = () => {
        setEditMode(!editMode)
    }

    const getGradeCode = grade => {
        switch (grade) {
            case '골드':
                return 'G1'
            case '실버':
                return 'G2'
            case '브론즈':
                return 'G3'
            default:
                return ''
        }
    }

    const getRoleCode = role => {
        switch (role) {
            case '관리자':
                return 'R1'
            case '회원':
                return 'R2'
            case '블랙리스트':
                return 'R3'
            default:
                return ''
        }
    }

    // 회원 역할과 등급 업데이트
    const confirmUpdate = () => {
        Swal.fire({
            title: '변경 사항을 저장하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '저장',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                const memberId = selectedMember.member_id
                const gradeCode = getGradeCode(Grade)
                const roleCode = getRoleCode(Role)

                if (!gradeCode && !roleCode) {
                    Swal.fire(
                        '오류',
                        '유효하지 않은 등급 또는 역할 코드입니다.',
                        'error'
                    )
                    return
                }

                // 블랙리스트로 선택되었을 경우, 블랙리스트 사유 모달을 열기
                if (Role === '블랙리스트') {
                    openBlacklistModal()
                    return
                }

                updateMemberStatus({
                    member_id: memberId,
                    grade_code: gradeCode,
                    role_code: roleCode,
                })
                    .then(() => {
                        Swal.fire(
                            '성공',
                            '변경 사항이 저장되었습니다.',
                            'success'
                        )
                        setEditMode(false)
                        setModal(false) // 모달 닫기
                    })
                    .catch(error =>
                        Swal.fire(
                            '오류',
                            '변경 사항 저장에 실패했습니다.',
                            'error'
                        )
                    )
            }
        })
    }

    const openBlacklistModal = () => {
        getAllBlacklistReasons()
            .then(resp => setBlacklistReasons(resp.data))
            .then(() => setBlacklistModal(true))
            .catch(error => console.error('블랙리스트 사유 조회 실패:', error))
    }

    const closeBlacklistModal = () => {
        setBlacklistModal(false)
    }

    const confirmBlacklist = () => {
        Swal.fire({
            title: '블랙리스트로 등록하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '등록',
            cancelButtonText: '취소',
        }).then(result => {
            if (result.isConfirmed) {
                const memberId = selectedMember.member_id

                updateMemberStatus({
                    member_id: memberId,
                    grade_code: getGradeCode(Grade),
                    role_code: 'R3',
                    blacklist_reason_code: blacklistReason, // 블랙리스트 사유 추가
                })
                    .then(() => {
                        Swal.fire(
                            '성공',
                            '블랙리스트로 등록되었습니다.',
                            'success'
                        )
                        closeBlacklistModal()
                        setModal(false)
                        fetchMembers()
                    })
                    .catch(error =>
                        Swal.fire('오류', '블랙리스트 등록 실패', 'error')
                    )
            }
        })
    }

    const handlePageChange = pageNumber => {
        setPage(pageNumber)
    }

    // 검색 실행 시 자동으로 chosung을 '전체'로 변경하고 검색 수행
    const handleSearch = searchQuery => {
        setSearchTerm(searchQuery)
        setChosung('전체') // 검색 실행 시 필터를 전체로 설정
    }

    return (
        <div className={styles.memberContainer}>
            {/* Header */}
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
                            onClick={() => setChosung(filter)}
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

            {/* Member List */}
            <div className={styles.memberlist}>
                <div className={styles.memberHeader}>
                    <div className={styles.headerItem}>이름</div>
                    <div className={styles.headerItem}>아이디</div>
                    <div className={styles.headerItem}>전화번호</div>
                    <div className={styles.headerItem}>이메일</div>
                    <div className={styles.headerItem}>가입일시</div>
                </div>

                {members.length > 0 ? (
                    members.map((member, index) => (
                        <div
                            className={styles.memberRow}
                            key={index}
                            onClick={() => Modalopen(member.member_id)}
                        >
                            <div className={styles.memberItem}>
                                {member.name}
                            </div>
                            <div className={styles.memberItem}>
                                {member.member_id}
                            </div>
                            <div className={styles.memberItem}>
                                {member.phone}
                            </div>
                            <div className={styles.memberItem}>
                                {member.email}
                            </div>
                            <div className={styles.memberItem}>
                                {formatDate(member.signup_date)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>회원 목록이 없습니다</div>
                )}
            </div>

            {/* Paging Component */}
            <div className={styles.pagination}>
                <Paging
                    page={page}
                    count={totalMembers}
                    perpage={itemsPerPage}
                    setPage={handlePageChange}
                />
            </div>

            {/* 상세 모달 */}
            {Modal && selectedMember && (
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

                            <div className={styles.infoItem}>
                                <label>등급</label>
                                {editMode ? (
                                    <select
                                        value={Grade}
                                        onChange={e => setGrade(e.target.value)}
                                    >
                                        {grades.map(grade => (
                                            <option
                                                key={grade.grade_code}
                                                value={grade.grade_title}
                                            >
                                                {grade.grade_title}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={selectedMember.grade_code}
                                        readOnly
                                        disabled
                                    />
                                )}
                            </div>

                            <div className={styles.infoItem}>
                                <label>역할</label>
                                {editMode ? (
                                    <select
                                        value={Role || ''}
                                        onChange={e => setRole(e.target.value)}
                                    >
                                        {roles.map(role => (
                                            <option
                                                key={role.role_code}
                                                value={role.role_title}
                                            >
                                                {role.role_title}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={selectedMember.role_code}
                                        readOnly
                                        disabled
                                    />
                                )}
                            </div>
                        </div>

                        <div className={styles.buttons}>
                            {editMode ? (
                                <>
                                    <Button
                                        size="s"
                                        title="완료"
                                        onClick={confirmUpdate}
                                    />
                                    <Button
                                        size="s"
                                        title="취소"
                                        onClick={toggleEditMode}
                                    />
                                </>
                            ) : (
                                <>
                                    <Button
                                        size="s"
                                        title="수정"
                                        onClick={toggleEditMode}
                                    />
                                    <Button
                                        size="s"
                                        title="닫기"
                                        onClick={Modalclose}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 블랙리스트 모달 */}
            {blacklistModal && (
                <div className={styles.blackmodal}>
                    <div className={styles.blackmodalContent}>
                        <h2>블랙리스트 등록사유</h2>
                        <div className={styles.reason}>
                            {blacklistReasons.map((reason, index) => (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        value={reason.blacklist_reason_code}
                                        checked={
                                            blacklistReason ===
                                            reason.blacklist_reason_code
                                        }
                                        onChange={e =>
                                            setBlacklistReason(e.target.value)
                                        }
                                    />
                                    {reason.blacklist_reason_description}
                                </label>
                            ))}
                        </div>
                        <div className={styles.buttons}>
                            <Button
                                size="s"
                                title="등록"
                                onClick={confirmBlacklist}
                            />
                            <Button
                                size="s"
                                title="취소"
                                onClick={closeBlacklistModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Member
