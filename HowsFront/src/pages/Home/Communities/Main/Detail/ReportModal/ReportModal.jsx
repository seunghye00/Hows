import React from 'react'
import { Button } from '../../../../../../components/Button/Button'
import { Modal } from '../../../../../../components/Modal/Modal'
import styles from './ReportModal.module.css'

export const ReportModal = ({
    isModalOpen,
    setIsModalOpen,
    reportsData,
    selectedReports,
    setSelectedReports,
    handleReportSubmit,
}) => {
    return (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className={styles.reportModal}>
                <h3>신고 사유를 선택해주세요</h3>
                <ul className={styles.reportlist}>
                    {reportsData && reportsData.length > 0 ? (
                        reportsData.map(report => (
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
                                        checked={
                                            selectedReports ===
                                            report.report_code
                                        }
                                        onChange={() =>
                                            setSelectedReports(
                                                report.report_code
                                            )
                                        }
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
                <Button
                    size="w"
                    title="신고하기"
                    onClick={handleReportSubmit}
                />
            </div>
        </Modal>
    )
}
