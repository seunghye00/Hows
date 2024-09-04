import styles from './Footer.module.css'
import { useNavigate } from 'react-router-dom'
export const Footer = () => {
    const navigate = useNavigate()
    const handleCustomerClick = () => {}
    return (
        <div className="footer">
            <div className={styles.footerWrap}>
                <div className={styles.customer}>
                    <div className={styles.customerCont}>
                        <div className={styles.customerInfo}>
                            <div className={styles.customerTit}>
                                <a
                                    onClick={() => {
                                        navigate('/mypage')
                                    }}
                                >
                                    고객센터
                                    <i class="bx bx-chevron-right"></i>
                                </a>
                            </div>
                            <div className={styles.customerBtn}>
                                <button type="button">카톡 상담</button>
                                <button type="button">이메일 문의</button>
                            </div>
                        </div>
                        <div className={styles.customerTime}>
                            <div className={styles.customerTimeBox}>
                                <span>1588 - 1588</span>
                                <span>09:00 ~ 18:00</span>
                            </div>
                            <ul className={styles.customerDay}>
                                <li>· 평일: 전체 문의 상담 가능</li>
                                <li>· 토요일·공휴일: 카카오톡 상담</li>
                                <li>· 일요일: 휴무</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.border}></div>
                <div className={styles.company}>
                    <div className={styles.companyInfo}>
                        <div className={styles.companyTxt}>(주) 도비즈</div>
                        <div className={styles.companyTxt}>
                            <span>|</span>
                            대표이사 노시온
                        </div>
                        <div className={styles.companyTxt}>
                            <span>|</span>
                            서울 동대문구 한빛로 12 5층 505호
                        </div>
                        <div className={styles.companyTxt}>
                            <span>|</span>
                            wjsdmsal9865@google.com
                        </div>
                        <div className={styles.companyTxt}>
                            <span>|</span>
                            사업자 번호 2024-10-01
                        </div>
                        <div className={styles.companyTxt}>
                            <span>|</span>
                            대표 번호 01051224519
                        </div>
                    </div>
                    <div className={styles.companySns}>
                        <div className={styles.sns}>
                            <i class="bx bxl-youtube"></i>
                        </div>
                        <div className={styles.sns}>
                            <i class="bx bxl-instagram-alt"></i>
                        </div>
                        <div className={styles.sns}>
                            <i class="bx bxl-facebook-square"></i>
                        </div>
                        <div className={styles.sns}>
                            <i class="bx bxl-github"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
