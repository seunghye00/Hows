import React from 'react';
import styles from './DeliveryInfo.module.css';

export const DeliveryInfo = () => (
    <div className={styles.container}>
        {/* 상품 질문 내용 */}
        <div>
            <h3>배송</h3>
            <div>
                <div className={styles.line}>
                    <div>배송</div>
                    <div>일반택배</div>
                </div>
                <div className={styles.line}>
                    <div>배송비</div>
                    <div>3,500원  <span>100,000원 이상 구매시 무료배송</span></div>
                </div>
                <div className={styles.line}>
                    <div>도서산간 추가 배송비</div>
                    <div>5,000원</div>
                </div>
                <div className={styles.line}>
                    <div>배송불가 지역</div>
                    <div>배송불가 지역이 없습니다.</div>
                </div>
            </div>
            <h3>교환/환불</h3>
            <div>
                <div className={styles.line}>
                    <div>반품 배송비</div>
                    <div>3,500원  <span>최초 배송비가 무료인 경우 5,000원 부과</span></div>
                </div>
                <div className={styles.line}>
                    <div>교환 배송비</div>
                    <div>5,000원</div>
                </div>
                <div className={styles.line}>
                    <div>보내실 곳</div>
                    <div>서울 동대문구 한빛로 12 5층 505호</div>
                </div>
            </div>
        </div>
        <div>
            <h4>반품/교환 사유에 따른 요청 가능 기간</h4>
            <p>반품 시 먼저 판매자와 연락하셔서 반품사유, 택배사, 배송비, 반품지 주소 등을 협의하신 후 반품상품을 발송해 주시기 바랍니다.</p>
            <ol>
                <li>구매자 단순 변심은 상품 수령 후 7일 이내  <span>구매자 반품배송비 부담</span></li>
                <li>표시/광고와 상이, 계약내용과 다르게 이행된 경우 상품 수령 후 3개월 이내 경과 시 반품/교환 불가  <span>판매자 반품배송비 부담</span></li>
            </ol>

            <h4>반품/교환 불가능 사유</h4>
            <p>아래와 같은 경우 반품/교환이 불가능합니다.</p>
            <ol>
                <li>반품요청기간이 지난 경우</li>
                <li>구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우  <span>단, 상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외</span></li>
                <li>포장을 개봉하였으나 포장이 훼손되어 상품가치가 현저히 상실된 경우</li>
                <li>구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우</li>
                <li>시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</li>
                <li>고객주문 확인 후 상품제작에 들어가는 주문제작상품</li>
                <li>복제가 가능한 상품 등의 포장을 훼손한 경우</li>
            </ol>
        </div>
        <div className={styles.card}>
            <div className={styles.card_line}>
                <div className={styles.label}>상호</div>
                <div className={styles.value}>(주) 도비즈</div>
            </div>
            <div className={styles.card_line}>
                <div className={styles.label}>대표자</div>
                <div className={styles.value}>노시온</div>
            </div>
            <div className={styles.card_line}>
                <div className={styles.label}>사업장소재지</div>
                <div className={styles.value}>서울 동대문구 한빛로 12 5층 505호</div>
            </div>
            <div className={styles.card_line}>
                <div className={styles.label}>고객센터 전화번호</div>
                <div className={styles.value}>010-5122-4519</div>
            </div>
            <div className={styles.card_line}>
                <div className={styles.label}>E-mail</div>
                <div className={styles.value}>shaaa6256@gmail.com</div>
            </div>
            <div className={styles.card_line}>
                <div className={styles.label}>사업자 등록번호</div>
                <div className={styles.value}>2024-10-01</div>
            </div>
        </div>
    </div>
);
