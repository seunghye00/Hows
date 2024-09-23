import styles from "./Guestbook.module.css";
import profile from "../../../../../assets/images/기본사진.jpg";
import { useMemberStore } from "../../../../../store/store";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { format } from "date-fns";
import {
  deleteGuestbook,
  findMemberSeq,
  getGuestbookList,
  insertGuestbook,
} from "../../../../../api/member";
import Swal from "sweetalert2";

export const Guestbook = () => {
  const navi = useNavigate();

  const { memberSeq, setMemberSeq, currentUser, memberId, setMemberId } =
    useMemberStore();
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
    setMemberId(sessionStorage.getItem("member_id"));
  }, [member_id, setMemberSeq]);

  // "등록" 버튼
  const handleWriteBtn = () => {
    const content = inputRef.current.innerHTML;
    const MAX_CONTENT_LENGTH = 300;

    // 글자 수 확인 후 제출
    if (content.length > MAX_CONTENT_LENGTH) {
      Swal.fire({
        icon: "warning",
        title: "글자 수 제한",
        text: `방명록 내용은 ${MAX_CONTENT_LENGTH}자를 초과할 수 없습니다.`,
        showConfirmButton: true,
      });
      return;
    }

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
        inputRef.current.innerHTML = "";
      }
    });
  };

  // 전체 출력
  useEffect(() => {
    if (memberSeq) {
      getGuestbookList(memberSeq).then((resp) => {
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

  // 마이페이지로 이동
  const goToUserPage = (member_id) => {
    console.log("Navigating to user page:", member_id); // member_id 확인 로그
    navi(`/mypage/main/${member_id}/post`); // member_id를 기반으로 마이페이지 경로 설정
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
          <img src={currentUser.member_avatar || profile} alt="" />
          <div
            ref={inputRef} // ref 설정
            className={styles.inputText}
            contentEditable="true"
            suppressContentEditableWarning={true}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!e.shiftKey) {
                  e.preventDefault(); // 기본 Enter 동작(줄바꿈)을 막기
                  handleWriteBtn(); // 글 작성 함수 호출
                }
              }
            }}
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
                  <span onClick={() => goToUserPage(output.member_id)}>
                    {output.nickname}
                  </span>
                  <span> {write_currentDate}</span>
                </div>
                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{
                    __html: output.guestbook_contents,
                  }} // 줄바꿈 포함하여 렌더링
                />
              </div>
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
