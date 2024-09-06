import React, { useState, useEffect } from 'react'
import styles from './Member.module.css'
import { Search } from '../../../components/Search/Search'
import { Paging } from '../../../components/Pagination/Paging'
import { Button } from '../../../components/Button/Button'
import {
    selectAll,
    detailmember,
    updateGrade,
    updateRole,
    getAllBlacklistReasons,
    addBlacklist,
    getAllGrades,
    getAllRoles,
} from '../../../api/member'

export const Member = () => {
    const [members, setMembers] = useState([])
    const [Modal, setModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [blacklistModal, setBlacklistModal] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)
    const [blacklistReasons, setBlacklistReasons] = useState([])
    const [Grade, setGrade] = useState('')
    const [Role, setRole] = useState('')
    const [grades, setGrades] = useState([]) // 서버에서 받아온 등급 데이터
    const [roles, setRoles] = useState([]) // 서버에서 받아온 역할 데이터
    const [blacklistReason, setBlacklistReason] = useState('')
    const [searchTerm, setSearchTerm] = useState('') // 검색어
    const [filteredMembers, setFilteredMembers] = useState([]) // 검색된 회원 목록

    useEffect(() => {
        // 전체 회원 조회
        selectAll()
            .then(resp => setMembers(resp.data))
            .catch(error => console.error('전체 회원 조회 실패:', error))

        // 서버에서 등급 정보 가져오기
        getAllGrades()
            .then(resp => setGrades(resp.data))
            .catch(error => console.error('등급 조회 실패:', error))

        // 서버에서 역할 정보 가져오기
        getAllRoles()
            .then(resp => setRoles(resp.data))
            .catch(error => console.error('역할 조회 실패:', error))
    }, [])

    useEffect(() => {
        // 검색어가 바뀔 때마다 필터링된 회원 목록 업데이트
        setFilteredMembers(
            members.filter(member =>
                member.nickname.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }, [searchTerm, members])

    // 모달 열기 및 회원 상세 조회 API 호출
    const Modalopen = member_id => {
        detailmember(member_id)
            .then(resp => {
                setSelectedMember(resp.data)
                setModal(true)
                setGrade(resp.data.grade_code || '') // grade_code가 없을 경우 빈 문자열 설정
                setRole(resp.data.role_code || '') // role_code가 없을 경우 빈 문자열 설정
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

    const confirmUpdate = () => {
        const memberId = selectedMember.member_id

        // 등급과 역할 업데이트 API 호출
        updateGrade({ member_id: memberId, grade_code: Grade })
            .then(() => updateRole({ member_id: memberId, role_code: Role }))
            .then(() => {
                alert('역할과 등급이 수정되었습니다.')
                setEditMode(false)
            })
            .catch(error => {
                console.error('업데이트 실패:', error)
                alert('업데이트에 실패했습니다.')
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
        const memberId = selectedMember.member_id

        // 블랙리스트 사유 등록 및 역할 업데이트
        addBlacklist({ member_id: memberId, reason: blacklistReason })
            .then(() => updateRole({ member_id: memberId, role_code: 'R3' }))
            .then(() => {
                alert('블랙리스트로 등록되었습니다.')
                closeBlacklistModal()
                setModal(false)
            })
            .catch(error => {
                console.error('블랙리스트 등록 실패:', error)
                alert('블랙리스트 등록에 실패했습니다.')
            })
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
                            className={`${styles.filterItem}`}
                            onClick={() => console.log(filter)} // 필터 클릭 시 처리 로직 추가 가능
                        >
                            {filter}
                        </span>
                    ))}
                </div>
                <div className={styles.searchSection}>
                    <Search
                        placeholder="아이디 또는 이름 검색"
                        onSearch={setSearchTerm} // 검색어 업데이트
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
                    <div className={styles.headerItem}>가입 날짜</div>
                </div>

                {filteredMembers.length > 0 ? (
                    filteredMembers.map((member, index) => (
                        <div
                            className={styles.memberRow}
                            key={index}
                            onClick={() => Modalopen(member.member_id)} // 클릭 시 상세 조회
                        >
                            <div className={styles.memberItem}>
                                {member.nickname}
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
                                {member.signup_date}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>회원 목록이 없습니다</div>
                )}
            </div>

            {/* Paging Component */}
            <div className={styles.pagination}>
                <Paging />
            </div>

            {/* 상세 모달 */}
            {Modal &&
                selectedMember &&
                selectedMember.grade_code && ( // 추가된 조건
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>{selectedMember.member_id} 님의 회원정보</h2>
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
                                            selectedMember.withdrawal_date ||
                                            ' '
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
                                            onChange={e =>
                                                setGrade(e.target.value)
                                            }
                                        >
                                            {grades.map(grade => (
                                                <option
                                                    key={grade.grade_code}
                                                    value={grade.grade_code}
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
                                            value={Role}
                                            onChange={e => {
                                                setRole(e.target.value)
                                                if (e.target.value === 'R3') {
                                                    openBlacklistModal()
                                                }
                                            }}
                                        >
                                            {roles.map(role => (
                                                <option
                                                    key={role.role_code}
                                                    value={role.role_code}
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
