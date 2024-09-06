import React, { useState } from 'react'
import styles from './Member.module.css'
import test from '../../../assets/images/푸바오.png'
import { Search } from '../../../components/Search/Search'

export const Member = () => {
    const [Modal, setModal] = useState(false)
    const [editMode, setEditMode] = useState(false) // 수정 모드 상태
    const [blacklistModal, setBlacklistModal] = useState(false) // 블랙리스트 모달 상태
    const [selectedMember, setSelectedMember] = useState(null) // 선택된 회원 데이터

    const [Grade, setGrade] = useState('브론즈')
    const [Role, setRole] = useState('회원')
    const [blacklistReason, setBlacklistReason] = useState('')
    const [searchResults, setSearchResults] = useState([]) // 검색 결과 상태
    const [members, setMembers] = useState([
        // 여러 명의 회원 임시 데이터
        {
            id: 'user1234',
            nickname: '민바오',
            birthdate: '2000년 10월 17일',
            phone: '010-1234-5678',
            email: 'user1@naver.com',
            address: '한빛로12',
            detailAddress: '5층 한정교',
            grade: '브론즈',
            role: '회원',
            joinDate: '2024-08-31',
            withdrawalDate: '',
        },
        {
            id: 'user5678',
            nickname: '홍길동',
            birthdate: '1990년 05월 20일',
            phone: '010-9876-5432',
            email: 'user2@naver.com',
            address: '서울시 강남구',
            detailAddress: '101동 304호',
            grade: '실버',
            role: '관리자',
            joinDate: '2022-05-20',
            withdrawalDate: '',
        },
    ])

    const Modalopen = member => {
        setSelectedMember(member) // 선택된 회원 데이터를 저장
        setModal(true)
    }

    const Modalclose = () => {
        setModal(false)
        setEditMode(false) // 수정 모드 종료
        setSelectedMember(null) // 선택된 회원 데이터 초기화
    }

    const toggleEditMode = () => {
        setEditMode(!editMode)
    }

    const openBlacklistModal = () => {
        setBlacklistModal(true)
    }

    const closeBlacklistModal = () => {
        setBlacklistModal(false)
    }

    const confirmUpdate = () => {
        if (Role === '블랙리스트') {
            openBlacklistModal()
        } else {
            alert('역할과 등급이 수정되었습니다.')
            setEditMode(false)
        }
    }

    const confirmBlacklist = () => {
        alert(`블랙리스트로 등록되었습니다. 사유: ${blacklistReason}`)
        closeBlacklistModal()
        setModal(false)
    }

    // 검색 기능 구현
    const handleSearch = query => {
        const results = members.filter(
            member =>
                member.nickname.includes(query) || member.id.includes(query)
        )
        setSearchResults(results) // 검색 결과 업데이트
    }

    return (
        <div className={styles.memberContainer}>
            <div className={styles.headerSection}>
                <div className={styles.filter}>
                    전체 ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ
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
                    <div className={styles.headerItem}>전화번호</div>
                    <div className={styles.headerItem}>이메일</div>
                    <div className={styles.headerItem}>가입 날짜</div>
                </div>

                {(searchResults.length > 0 ? searchResults : members).map(
                    (member, index) => (
                        <div
                            className={styles.memberRow}
                            key={index}
                            onClick={() => Modalopen(member)}
                        >
                            <div className={styles.memberItem}>
                                {member.nickname}
                            </div>
                            <div className={styles.memberItem}>{member.id}</div>
                            <div className={styles.memberItem}>
                                {member.phone}
                            </div>
                            <div className={styles.memberItem}>
                                {member.email}
                            </div>
                            <div className={styles.memberItem}>
                                {member.joinDate}
                            </div>
                        </div>
                    )
                )}
            </div>

            {Modal && selectedMember && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{selectedMember.id} 님의 회원정보</h2>
                        <div className={styles.profile}>
                            <img src={test} alt="프로필 이미지" />
                        </div>
                        <div className={styles.info}>
                            <div className={styles.infoItem}>
                                <label>닉네임</label>
                                <input
                                    type="text"
                                    value={selectedMember.nickname}
                                    readOnly
                                    disabled="true"
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>생년월일</label>
                                <input
                                    type="text"
                                    value={selectedMember.birthdate}
                                    readOnly
                                    disabled="true"
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>전화번호</label>
                                <input
                                    type="text"
                                    value={selectedMember.phone}
                                    readOnly
                                    disabled="true"
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>이메일</label>
                                <input
                                    type="text"
                                    value={selectedMember.email}
                                    readOnly
                                    disabled="true"
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>주소</label>
                                <input
                                    type="text"
                                    value={selectedMember.address}
                                    readOnly
                                    disabled="true"
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>상세주소</label>
                                <input
                                    type="text"
                                    value={selectedMember.detailAddress}
                                    readOnly
                                    disabled="true"
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>가입날짜</label>
                                <input
                                    type="text"
                                    value={selectedMember.joinDate}
                                    readOnly
                                    disabled="true"
                                />
                            </div>
                            <div className={styles.infoItem}>
                                <label>탈퇴날짜</label>
                                <input
                                    type="text"
                                    value={
                                        selectedMember.withdrawalDate ||
                                        '(빈칸)'
                                    }
                                    readOnly
                                    disabled="true"
                                />
                            </div>

                            <div className={styles.infoItem}>
                                <label>등급</label>
                                {editMode ? (
                                    <select
                                        value={Grade}
                                        onChange={e => setGrade(e.target.value)}
                                    >
                                        <option value="골드">골드</option>
                                        <option value="실버">실버</option>
                                        <option value="브론즈">브론즈</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={selectedMember.grade}
                                        readOnly
                                    />
                                )}
                            </div>

                            <div className={styles.infoItem}>
                                <label>역할</label>
                                {editMode ? (
                                    <select
                                        value={Role}
                                        onChange={e => setRole(e.target.value)}
                                    >
                                        <option value="회원">회원</option>
                                        <option value="블랙리스트">
                                            블랙리스트
                                        </option>
                                        <option value="관리자">관리자</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={selectedMember.role}
                                        readOnly
                                    />
                                )}
                            </div>
                        </div>

                        <div className={styles.buttons}>
                            {editMode ? (
                                <>
                                    <button onClick={confirmUpdate}>
                                        완료
                                    </button>
                                    <button onClick={toggleEditMode}>
                                        취소
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={toggleEditMode}>
                                        수정
                                    </button>
                                    <button onClick={Modalclose}>닫기</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {blacklistModal && (
                <div className={styles.blackmodal}>
                    <div className={styles.blackmodalContent}>
                        <h2>블랙리스트 등록사유</h2>
                        <div className={styles.reason}>
                            <label>
                                <input
                                    type="radio"
                                    value="과도한 욕설"
                                    checked={blacklistReason === '과도한 욕설'}
                                    onChange={e =>
                                        setBlacklistReason(e.target.value)
                                    }
                                />
                                과도한 욕설
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="음란물 배포"
                                    checked={blacklistReason === '음란물 배포'}
                                    onChange={e =>
                                        setBlacklistReason(e.target.value)
                                    }
                                />
                                음란물 배포
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="스팸 또는 과도한 광고"
                                    checked={
                                        blacklistReason ===
                                        '스팸 또는 과도한 광고'
                                    }
                                    onChange={e =>
                                        setBlacklistReason(e.target.value)
                                    }
                                />
                                스팸 또는 과도한 광고
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="사기 행위"
                                    checked={blacklistReason === '사기 행위'}
                                    onChange={e =>
                                        setBlacklistReason(e.target.value)
                                    }
                                />
                                사기 행위
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="부적절한 콘텐츠 게시"
                                    checked={
                                        blacklistReason ===
                                        '부적절한 콘텐츠 게시'
                                    }
                                    onChange={e =>
                                        setBlacklistReason(e.target.value)
                                    }
                                />
                                부적절한 콘텐츠 게시
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="개인정보 유출"
                                    checked={
                                        blacklistReason === '개인정보 유출'
                                    }
                                    onChange={e =>
                                        setBlacklistReason(e.target.value)
                                    }
                                />
                                개인정보 유출
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="정치적 성향 강제"
                                    checked={
                                        blacklistReason === '정치적 성향 강제'
                                    }
                                    onChange={e =>
                                        setBlacklistReason(e.target.value)
                                    }
                                />
                                정치적 성향 강제
                            </label>
                        </div>
                        <div className={styles.buttons}>
                            <button onClick={confirmBlacklist}>등록</button>
                            <button onClick={closeBlacklistModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.pagination}>
                <i className="bx bx-chevron-left"></i>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <i className="bx bx-chevron-right"></i>
            </div>
        </div>
    )
}

export default Member
