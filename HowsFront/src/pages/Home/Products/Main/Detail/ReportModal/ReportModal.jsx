import { useState, useEffect } from 'react';
import styles from './ReportModal.module.css'
import Swal from 'sweetalert2';
import { Modal } from '../../../../../../components/Modal/Modal'; // 모달 컴포넌트 가져오기
import { getReport , sendReviewReport} from '../../../../../../api/product';

const ReportModal = ({ reviewSeq, memberId, isOpen, onClose }) => {

    const [reportReasons, setReportReasons] = useState([]); // 신고 사유 목록 상태
    const [selectedReason, setSelectedReason] = useState(''); // 선택된 신고 사유 상태

    // 신고 옵션
    useEffect(() => {
        const fetchReportReasons = async () => {
            try {
                const response = await getReport(); 
                setReportReasons(response); // 신고 사유 데이터를 상태에 저장
            } catch (error) {
                console.error('신고 사유를 불러오는 중 오류 발생', error);
            }
        };

        fetchReportReasons();
    }, []);

    const handleReport = async () => {
        if (!selectedReason) {
            Swal.fire({
                icon: 'warning',
                title: '신고 사유를 선택해 주세요.',
                showConfirmButton: true,
            });
            return;
        }


        try {
            
            await sendReviewReport(reviewSeq, selectedReason, memberId);

            Swal.fire({
                icon: 'success',
                title: '신고가 접수되었습니다.',
                showConfirmButton: true,
            }).then(() => {
                onClose(); // 신고 후 모달 닫기
            });
        } catch (error) {
            console.error('리뷰 신고 중 오류 발생', error);
            Swal.fire({
                icon: 'error',
                title: '신고 처리 중 오류가 발생했습니다.',
                showConfirmButton: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.reportModal}>
                <h3>리뷰 신고 사유를 선택해주세요</h3>
                <ul className={styles.reportlist}>
                    {reportReasons && reportReasons.length > 0 ? (
                        reportReasons.map((report) => (
                            <li
                                key={report.report_code}
                                className={styles.reportLi}
                            >
                                <label className={styles.reportLabel}>
                                    <input
                                        type="radio"
                                        name="report"
                                        value={report.report_code}
                                        className={styles.reportRadio}
                                        checked={selectedReason === report.report_code}
                                        onChange={() => setSelectedReason(report.report_code)}
                                    />
                                    <div className={styles.reportBox}></div>
                                    <span className={styles.reportTxt}>
                                        {report.report_description}
                                    </span>
                                </label>
                            </li>
                        ))
                    ) : (
                        <p>신고 옵션을 불러오는 중입니다...</p>
                    )}
                </ul>
                <div className={styles.reportBtn}>
                    <button onClick={handleReport}>신고하기</button>
                    <button onClick={onClose}>취소하기</button>
                </div>
            </div>
        </Modal>
    );
};

export default ReportModal;
