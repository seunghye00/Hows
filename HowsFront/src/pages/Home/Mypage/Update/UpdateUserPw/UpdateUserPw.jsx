import styles from "./UpdateUserPw.module.css"
import { useState } from 'react';

export const UpdateUserPw = () => {

    const [formData, setFormData] = useState({})


    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className={styles.container}>
            <div className={styles.updatePw}>
                <div className={styles.currentPw}>
                    <span className={styles.title}>현재 비밀번호</span>
                    <input
                        type="password"
                        placeholder="현재 사용 중인 비밀번호를 입력해주세요."
                        name="name"
                        onChange={handleChange}
                        className={styles.inputName}
                    ></input>
                </div>
                <div className={styles.newPw}>
                    <span className={styles.title}>새 비밀번호</span>
                    <span>
                        영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를
                        입력해주세요.
                    </span>
                    <input
                        type="password"
                        placeholder="새 비밀번호를 입력해주세요."
                        name="pw"
                        onChange={handleChange}
                        className={styles.inputPw}
                    ></input>
                </div>
                <div className={styles.newPw2}>
                    <span className={styles.title}>새 비밀번호 확인</span>
                    <input
                        type="password"
                        placeholder="한 번 더 입력해주세요."
                        name="pw2"
                        onChange={handleChange}
                        className={styles.inputPw2}
                    ></input>
                </div>
                <div className={styles.okBtn}>
                    <button>변경 완료</button>

                </div>

            </div>
        </div>
    )
}