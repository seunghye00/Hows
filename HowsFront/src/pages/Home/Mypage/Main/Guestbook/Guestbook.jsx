import styles from "./Guestbook.module.css";
import profile from "../../../../../assets/images/마이페이지_프로필사진.jpg";
import { useMemberStore } from "../../../../../store/store";
import { useEffect, useState, useRef } from 'react';
import { api } from "../../../../../config/config";


export const Guestbook = ({ memberId }) => {

    const { memberSeq, setMemberSeq } = useMemberStore();
    const [contents, setContents] = useState("");
    const [change, setChange] = useState(false);
    const inputRef = useRef(null);

    // 페이지 로드 시 member_seq 받아오기
    useEffect(() => {
        // 예시로 현재 사용자의 member_seq를 가져오는 API 호출
        api.get(`/guestbook/findMemberSeq`, { params: { member_id: memberId } }).then((resp) => {
            // const seq = resp.data.member_seq;
            const seq = resp.data;

            console.log("뭐니!!! : ", seq);

            setMemberSeq(seq); // zustand에 memberSeq 저장
        });
    }, [setMemberSeq]); // 처음 렌더링 시 1회만 실행


    // 글 작성
    const handleInput = (e) => {
        const htmlContent = e.target.innerHTML;
        console.log("작성 : ", htmlContent);
        setContents(htmlContent);
    };

    const handleWriteBtn = () => {
        const requestBody = {
            member_id: memberId,
            member_seq: memberSeq,
            contents: contents
        };


        console.log("seq; ", requestBody.member_seq);

        api.post(`/guestbook/insert`, requestBody).then((resp) => {

            console.log("결과 : ", resp.data);

            // if (resp.data !== "") {
            //     setChange((prev) => !prev);

            //     if (inputRef.current) {
            //         inputRef.current.innerHTML = ""; // div 내용 비우기
            //         setContents("");
            //     }
            // }
        });
    }

    // const write_date = new Date(user.guestbook_write_date);
    // const write_currentDate = !isNaN(write_date)
    //     ? format(write_date, "yyyy-MM-dd")
    //     : "Invalid Date";

    return (
        <div className={styles.container}>
            <div className={styles.countContents}>
                <span>3</span>
                <span>개의 방문글</span>
            </div>
            {/* =================== */}
            <div className={styles.visitPost}>
                <div className={styles.input}>
                    <img src={profile} alt="" />
                    <div
                        // ref={inputRef} // ref 설정
                        className={styles.inputText}
                        contentEditable="true"
                        onInput={handleInput}
                        suppressContentEditableWarning={true}
                    />
                    <button onClick={handleWriteBtn}>등록</button>
                </div>
                <div className={styles.output}>
                    <img src={profile} />
                    <div>
                        <div className={styles.writer_writeDate}>
                            <span>dobby111</span>
                            <span> 2024-09-05 16:15</span>
                        </div>
                        <div className={styles.content}>내용입니다.</div>
                    </div>
                    <button>X</button>
                </div>
                <div className={styles.output}>
                    <img src={profile} />
                    <div>
                        <div className={styles.writer_writeDate}>
                            <span>dobby111</span>
                            <span> 2024-09-05 16:15</span>
                        </div>
                        <div className={styles.content}>내용입니다.</div>
                    </div>
                    <button>X</button>
                </div>
                <div className={styles.output}>
                    <img src={profile} />
                    <div>
                        <div className={styles.writer_writeDate}>
                            <span>dobby111</span>
                            <span> 2024-09-05 16:15</span>
                        </div>
                        <div className={styles.content}>내용입니다.</div>
                    </div>
                    <button>X</button>
                </div>
            </div>
        </div>
    );
};
