import styles from "./FindId.module.css"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from '../../../../assets/images/logo_how.png'
import axios from "axios";
import { host } from './../../../../config/config';

export const FindId = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleFindBtn = () => {
        axios.post(`${host}/auth/findId`, null, { params: { name, email } }).then(resp => {
            alert(`아이디는 ${resp.data}입니다.`);
            onBack();
        }).catch(error => {
            alert('아이디를 찾을 수 없습니다. 입력하신 정보를 확인하세요.');
        });
    }


    return (
        <div className={styles.container}>

            <div className={styles.idFindBox}>
                <div className={styles.logo}>
                    <img src={logo}></img>
                    <h1 className={styles.title}>How's</h1>
                </div>
                <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
                <input type="text" name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
                <button className={styles.findBtn} onClick={handleFindBtn}>아이디 찾기</button>
                <button className={styles.backBtn} onClick={onBack}> 뒤로가기</button>
            </div>
        </div>
    )
}