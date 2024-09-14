import styles from "./Guestbook.module.css";
import profile from "../../../../../assets/images/마이페이지_프로필사진.jpg";
import { useMemberStore } from "../../../../../store/store";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../../../../config/config";
import { format } from "date-fns";
import {
  deleteGuestbook,
  findMemberSeq,
  getGuestbookList,
  insertGuestbook,
} from "../../../../../api/member";

export const Guestbook = () => {
  const { memberSeq, setMemberSeq, currentUser, memberId, setMemberId } = useMemberStore();
  const [contents, setContents] = useState("");
  const [outputs, setOutputs] = useState([]); // 방문 글 상태 추가
  const { member_id } = useParams();
  const inputRef = useRef(null);


  // 페이지 로드 시 member_seq 받아오기
  useEffect(() => {
    if (member_id) {
      findMemberSeq(member_id).then((resp) => {
        setMemberSeq(resp.data); // zustand에 memberSeq 저장
      });
    }
    setMemberId(sessionStorage.getItem("member_id"))
  }, [member_id, setMemberSeq]);

  // "등록" 버튼
  const handleWriteBtn = () => {
    const content = inputRef.current.innerText;
    const requestBody = {
      member_seq: memberSeq,
      guestbook_contents: content,
    };

    // 데이터를 서버에 저장한 후 전체 목록 다시 불러오기
    insertGuestbook(requestBody).then((resp) => {
      if (resp.data > 0) {
        getGuestbookList(memberSeq).then((resp) => {
          setOutputs(resp.data);
        });
        setContents("");
        inputRef.current.innerText = "";
      }
    });
  };

  // 전체 출력
  useEffect(() => {
    if (memberSeq) {
      getGuestbookList(memberSeq).then((resp) => {
        console.log("누굴까 : ", resp.data);
        setOutputs(resp.data);
      });
    }
  }, [memberSeq]);

  const handleDelBtn = (guestbook_seq) => {
    deleteGuestbook(guestbook_seq)
      .then((resp) => {
        setOutputs(
          outputs.filter((output) => output.guestbook_seq !== guestbook_seq)
        );
      })
      .catch((error) => {
        console.error("삭제 실패:", error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.countContents}>
        <span>{outputs.length}</span>
        <span>개의 방문글</span>
      </div>
      {/* =================== */}
      <div className={styles.visitPost}>
        <div className={styles.input}>
          <img src={currentUser.member_avatar} alt="" />
          <div
            ref={inputRef} // ref 설정
            className={styles.inputText}
            contentEditable="true"
            suppressContentEditableWarning={true}
          />
          <button onClick={handleWriteBtn}>등록</button>
        </div>

        {outputs.map((output, i) => {
          const write_date = new Date(output.guestbook_write_date);
          const write_currentDate = !isNaN(write_date)
            ? format(write_date, "yyyy-MM-dd HH:mm:ss")
            : "Invalid Date";

          return (
            <div className={styles.output} key={i}>
              <img
                src={output.member_avatar || profile}
                alt={`${output.nickname}의 프로필`}
              />
              <div>
                <div className={styles.writer_writeDate}>
                  <span>{output.nickname}</span>
                  <span> {write_currentDate}</span>
                </div>
                <div className={styles.content}>
                  {output.guestbook_contents}
                </div>
              </div>
              {/* 로그인된 사용자와 댓글 작성자가 같은 경우에만 X 버튼 표시 */}
              {output.member_id === memberId && (
                <button onClick={() => handleDelBtn(output.guestbook_seq)}>
                  X
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
