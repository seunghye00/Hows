-- 회원
create table member (
    member_seq number primary key,
    member_id varchar2(20) not null,
    pw varchar2(128) not null,
    name varchar2(30) not null,
    nickname varchar2(50) not null,
    birth varchar2(8) not null,
    gender char(1) not null,
    phone varchar2(11) not null,
    email varchar2(50) not null,
    zip_code varchar2(10) not null,
    address varchar2(255) not null,
    detail_address varchar2(255) not null,
    grade_code char(2) default 'G3' not null,
    role_code char(2) default 'R2' not null,
    blacklist_reason_code char(2) default null,
    blacklist_date timestamp default null,
    signup_date timestamp default sysdate,
    withdrawal_date timestamp default null,
    withdrawal_yn char(1) default 'N',
    member_banner varchar2(500) default null,
    point number default 0,
    member_avatar varchar2(200) default 'https://storage.cloud.google.com/hows-attachment/F1/90855e98-54c0-47af-8935-b1b0b5bff526'
);

-- 방명록
create table guestbook (
    guestbook_seq number primary key,
    guestbook_contents varchar2(900) not null,
    guestbook_write_date timestamp default sysdate,
    member_seq number not null, -- 방명록이 작성된 사용자의 시퀀스
    member_id varchar2(20) not null
);

-- 등급
create table grade (
    grade_code char(2) primary key,
    grade_title varchar2(20)
);

-- 역할
create table role (
    role_code char(2) primary key,
    role_title varchar2(20)
);

-- 팔로우
create table follow (
    follow_seq number primary key,
    from_member_seq number not null, 
    to_member_seq number not null
);

-- 블랙리스트 사유
create table blacklist_reason(
    blacklist_reason_code char(2) primary key,
    blacklist_reason_description varchar2(50)
);

-- 게시판
create table board (
    board_seq number primary key,
    board_contents varchar2(4000) not null,
    board_write_date  timestamp default sysdate,
    view_count number default 0,
    housing_type_code char(2) not null,
    space_type_code char(2) not null,
    area_size_code char(2) not null,
    color_code char(2) not null,
    member_id varchar2(20) not null
);

-- 게시판 이미지
create table board_image (
    board_image_seq number primary key,          
    board_seq number not null,                 
    image_url varchar2(500) not null,    
    image_order number not null          
);

-- 게시판 이미지 상품 태그
create table board_tag (
    board_tag_seq number primary key,       
    board_image_seq number not null,              
    product_seq number not null,
    left_position NUMBER not null,
    top_position NUMBER not null
);

-- 주거 형태
create table housing_type (
    housing_type_code char(2) primary key,
    housing_type_title varchar2(30)
);

-- 공간
create table space_type (
    space_type_code char(2) primary key,
    space_type_title varchar2(30)
);

-- 평수
create table area_size (
    area_size_code char(2) primary key,
    area_size_title varchar2(20)
);

--컬러
create table color (
    color_code char(2) primary key,
    color_title varchar2(20)
);

-- 북마크
create table board_book_mark (
    board_book_mark_seq number primary key,
    member_id varchar2(20) not null,
    board_seq number not null
);

-- 게시판 좋아요
create table board_like(
    board_like_seq number primary key,
    member_id varchar2(20) not null,
    board_seq number not null
);

-- 게시판 신고
create table board_report(
    board_report_seq number primary key,
    report_code char(2) not null,
    board_report_date timestamp default sysdate,
    member_id varchar2(20) not null,
    board_seq number not null
);

-- 댓글
create table comments (
    comment_seq number primary key,
    comment_contents varchar2(900) not null,
    comment_write_date timestamp default sysdate,
    board_seq number not null,
    member_id varchar2(20) not null
);

-- 댓글 좋아요
create table comment_like (
    comment_like_seq number primary key,
    member_id varchar2(20) not null,
    comment_seq number not null
);

-- 댓글 신고
create table comment_report (
    comment_report_seq number primary key,
    report_code char(2) not null,
    comment_report_date timestamp default sysdate,
    member_id varchar2(20) not null,
    comment_seq number not null
);

-- 대댓글
create table  reply (
    reply_seq number primary key,
    reply_contents varchar2(900) not null,
    reply_date timestamp default sysdate,
    comment_seq number not null,
    member_id varchar2(20) not null
);

-- 대댓글 좋아요
create table reply_like (
    reply_like_seq number primary key,
    member_id varchar2(20) not null,
    reply_seq number not null
);

-- 대댓글 신고
create table reply_report (
    reply_report_seq number primary key,
    report_code char(2) not null,
    reply_report_date timestamp default sysdate,
    member_id varchar2(20) not null,
    reply_seq number not null
);

-- 상품
create table product (
    product_seq number primary key,
    product_thumbnail varchar2(255) not null,
    product_title varchar2(100) not null,
    product_contents varchar2(4000) not null,
    price number not null,
    quantity number not null,
    product_category_code char(2) not null
);


-- 상품 카테고리
create table product_category (
    product_category_code char(2) primary key,
    product_category_title varchar2(50)
);



-- 상품 좋아요
create table product_like (
    product_like_seq number primary key,
    product_seq number not null,
    member_id varchar2(20) not null
);

-- 리뷰
create table review (
    review_seq number primary key,
    review_contents varchar2(900) not null,
    review_date timestamp default sysdate,
    rating number not null,
    product_seq number not null,
    member_id varchar2(20) not null
);
    
-- 리뷰 좋아요
create table review_like (
    review_like_seq number primary key,
    review_seq number not null,
    member_id varchar2(20) not null
);


-- 리뷰 신고
create table review_report (
    review_report_seq number primary key,
    report_code char(2) not null,
    review_report_date timestamp default sysdate,
    review_seq number not null,
    member_id varchar2(20) not null
);


-- 리뷰 이미지 관리
create table review_image (
    review_image_seq number primary key,          
    review_seq number not null,                 
    image_url varchar2(500) not null,    
    image_order number not null          
);

-- 장바구니
create table cart (
    cart_seq number primary key,
    product_seq number not null,
    member_seq number not null,
    cart_quantity number not null,
    cart_price number not null,
    cart_date timestamp default sysdate not null
);

-- 주문
create table orders (
    order_seq number primary key,
    member_seq number not null,
    order_code char(2) not null,
    order_name varchar2(200) not null,
    order_date timestamp default sysdate not null,
    order_price number not null,
    orderer_name varchar2(30) not null,
    orderer_phone varchar2(11) not null,
    orderer_zip_code varchar2(10) not null,
    orderer_address varchar2(255) not null,
    orderer_detail_address varchar2(255) not null,
    done_delivery_date timestamp default null
);

-- 주문상태
create table order_status (
    order_code char(2) primary key,
    order_title varchar2(50)
);

-- 주문 리스트
create table order_list (
     order_list_seq number primary key,
     order_seq number not null,
     product_seq number not null,
     order_list_count number not null,
     order_list_price number not null
);

-- 쿠폰
create table coupon (
    coupon_seq number primary key,
    coupon_title varchar2(100) not null,
    coupon_type varchar2(20) not null,
    coupon_discount varchar2(20) default null,
    expired_date timestamp not null
);

-- 쿠폰 소유 
create table coupon_owner (
    coupon_owner_seq number primary key,
    member_seq number not null,
    coupon_seq number not null,
    order_seq number default 0,
    get_date timestamp default sysdate not null,
    use_date timestamp default null
);

-- 결제
create table payment (
    payment_seq number primary key,
    member_seq number not null,
    order_seq number not null,
    payment_code char(2) not null,
    payment_price number not null,    
    payment_date timestamp default sysdate,
    payment_id varchar2(100) not null,
    payment_text varchar2(500) default null
);

-- 결제 상태
create table payment_status (
    payment_code char(2) primary key,
    payment_title varchar2(50)
);

-- 반품
create table return (
    return_seq number primary key,
    order_seq number not null,
    payment_seq number not null,
    return_code char(2) not null,
	return_date timestamp not null,	-- 결재 취소 or 반품 요청일
	done_return_Date timestamp		-- 환불 완료일
);

-- 반품 상태
create table return_status (
    return_code char(2) primary key,
    return_title varchar2(50)
);

-- 포인트 내역 테이블
create table point_history (
   point_seq number primary key,
   member_seq number not null,
   point_where varchar2(30) not null,
   point_where_seq number not null,
   point_quantity number not null,
   point_remaining number not null,
   point_date timestamp default sysdate not null
);

-- 공지사항
create table notice (
    notice_seq number primary key,
    notice_title varchar2(100) not null,
    notice_contents varchar2(4000) not null,
    notice_date timestamp default sysdate,
    view_count number default 0 not null,
    notice_code char(2) default 'N1' not null
);


-- 이벤트
create table event (
    event_seq number primary key,
    event_title varchar2(100) not null,
    event_contents varchar2(4000) not null,
    event_date timestamp default sysdate,
    view_count number default 0 not null,
    notice_code char(2) default 'N2' not null
);

-- FAQ
create table faq (
    faq_seq number primary key,
    faq_title varchar2(100) not null,
    faq_contents varchar2(4000) not null,
    notice_code char(2) default 'N3' not null
);

-- 공지 코드
create table notice_code (
    notice_code char(2) primary key,
    notice_title varchar2(50)
);

-- 배너
create table banner (
    banner_seq number primary key,
    file_seq number not null,
    banner_url varchar2(300) not null,
    start_date Date,
    end_date Date,
    banner_order number not null,
    is_visible char(1) default 'N' not null,
    connect_seq number default 0
);

-- 신고사유
create table report (
    report_code char(2) primary key,
    report_description varchar2(50) 
);

-- 파일
create table files (
    file_seq number primary key,
    file_oriname varchar2(200) not null,
    file_sysname varchar2(200) not null,
    parent_seq number not null,
    file_code char(2) not null
);

--파일 코드
create table file_code (
    file_code char(2) primary key,
    file_title varchar2(50)
);


-- Sequence
create sequence member_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence guestbook_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence follow_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence board_image_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence board_tag_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence board_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence board_book_mark_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence board_like_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence board_report_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence comment_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence comment_like_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence comment_report_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence reply_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence reply_like_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence reply_report_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence product_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence product_like_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence review_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence review_like_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence review_report_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence review_image_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence cart_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence order_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence order_list_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence coupon_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence coupon_owner_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence payment_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence return_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence point_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence notice_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence event_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence faq_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence banner_seq start with 1 increment by 1 nomaxvalue nocache;

create sequence file_seq start with 1 increment by 1 nomaxvalue nocache;


-- dummy data
insert into grade (grade_code, grade_title) values ('G1', '골드');
insert into grade (grade_code, grade_title) values ('G2', '실버');
insert into grade (grade_code, grade_title) values ('G3', '브론즈');

insert into role (role_code, role_title) values ('R1', '관리자');
insert into role (role_code, role_title) values ('R2', '회원');
insert into role (role_code, role_title) values ('R3', '블랙리스트');

insert into blacklist_reason (blacklist_reason_code, blacklist_reason_description) values ('B1', '과도한 욕설');
insert into blacklist_reason (blacklist_reason_code, blacklist_reason_description) values ('B2', '음란물 배포');
insert into blacklist_reason (blacklist_reason_code, blacklist_reason_description) values ('B3', '스팸 또는 과도한 광고');
insert into blacklist_reason (blacklist_reason_code, blacklist_reason_description) values ('B4', '사기 행위');
insert into blacklist_reason (blacklist_reason_code, blacklist_reason_description) values ('B5', '부적절한 콘텐츠 게시');
insert into blacklist_reason (blacklist_reason_code, blacklist_reason_description) values ('B6', '개인정보 유출');
insert into blacklist_reason (blacklist_reason_code, blacklist_reason_description) values ('B7', '정치적 성향 강제');

insert into housing_type (housing_type_code, housing_type_title) values ('H1', '원룸 및 오피스텔');
insert into housing_type (housing_type_code, housing_type_title) values ('H2', '아파트');
insert into housing_type (housing_type_code, housing_type_title) values ('H3', '빌라');


insert into space_type (space_type_code, space_type_title) values ('S1', '원룸');
insert into space_type (space_type_code, space_type_title) values ('S2', '거실');
insert into space_type (space_type_code, space_type_title) values ('S3', '침실');
insert into space_type (space_type_code, space_type_title) values ('S4', '주방');
insert into space_type (space_type_code, space_type_title) values ('S5', '욕실');
insert into space_type (space_type_code, space_type_title) values ('S6', '베란다');
insert into space_type (space_type_code, space_type_title) values ('S7', '드레스룸');
insert into space_type (space_type_code, space_type_title) values ('S8', '서재');
insert into space_type (space_type_code, space_type_title) values ('S9', '기타');

insert into area_size (area_size_code, area_size_title) values ('A1', '10평 미만');
insert into area_size (area_size_code, area_size_title) values ('A2', '10평대');
insert into area_size (area_size_code, area_size_title) values ('A3', '20평대');
insert into area_size (area_size_code, area_size_title) values ('A4', '30평대');
insert into area_size (area_size_code, area_size_title) values ('A5', '40평대');
insert into area_size (area_size_code, area_size_title) values ('A6', '50평 이상');

insert into color (color_code, color_title) values ('C1', '화이트');
insert into color (color_code, color_title) values ('C2', '블랙');
insert into color (color_code, color_title) values ('C3', '그레이');
insert into color (color_code, color_title) values ('C4', '옐로우');
insert into color (color_code, color_title) values ('C5', '블루');
insert into color (color_code, color_title) values ('C6', '핑크');
insert into color (color_code, color_title) values ('C7', '레드');
insert into color (color_code, color_title) values ('C8', '브라운');

insert into product_category (product_category_code, product_category_title) values ('P1', '가구');
insert into product_category (product_category_code, product_category_title) values ('P2', '조명');
insert into product_category (product_category_code, product_category_title) values ('P3', '패브릭');
insert into product_category (product_category_code, product_category_title) values ('P4', '수납정리');
insert into product_category (product_category_code, product_category_title) values ('P5', '가전 및 디지털');
insert into product_category (product_category_code, product_category_title) values ('P6', '주방용품');

insert into order_status (order_code, order_title) values ('O1', '입금 대기');
insert into order_status (order_code, order_title) values ('O2', '결재 완료');
insert into order_status (order_code, order_title) values ('O3', '배송 준비');
insert into order_status (order_code, order_title) values ('O4', '배송 중');
insert into order_status (order_code, order_title) values ('O5', '배송 완료');
insert into order_status (order_code, order_title) values ('O6', '구매확정');
insert into order_status (order_code, order_title) values ('O7', '구매취소');

insert into coupon values ( coupon_seq.nextval, '[ 5% 할인 ] 가을 맞이 특가 5% 쿠폰', 'percent', '*0.95', '2024-12-31');
insert into coupon values ( coupon_seq.nextval, '[ 10% 할인 ] 가을 맞이 특가 10% 쿠폰', 'percent', '*0.9', '2024-12-31');
insert into coupon values ( coupon_seq.nextval, '[ 5000 할인 ] 가을 맞이 특가 5000원 할인 쿠폰', 'price', '-5000', '2024-12-31');
insert into coupon values ( coupon_seq.nextval, '[ 2000 할인 ] 한가위 맞이 2000원 할인 쿠폰', 'price', '-2000', '2024-12-31');

insert into payment_status (payment_code, payment_title) values ('P1', '결제대기');
insert into payment_status (payment_code, payment_title) values ('P2', '결제완료');
insert into payment_status (payment_code, payment_title) values ('P3', '결제실패');
insert into payment_status (payment_code, payment_title) values ('P4', '취소요청');
insert into payment_status (payment_code, payment_title) values ('P5', '결제취소');

insert into return_status (return_code, return_title) values ('R1', '결재 취소 요청');
insert into return_status (return_code, return_title) values ('R2', '반품 요청');
insert into return_status (return_code, return_title) values ('R3', '상품 검수');
insert into return_status (return_code, return_title) values ('R4', '반품 불가');
insert into return_status (return_code, return_title) values ('R5', '반품 확정');
insert into return_status (return_code, return_title) values ('R6', '환불 완료');

insert into notice_code (notice_code, notice_title) values ('N1', '공지사항');
insert into notice_code (notice_code, notice_title) values ('N2', '이벤트');
insert into notice_code (notice_code, notice_title) values ('N3', 'FAQ');

insert into report (report_code, report_description) values ('R1', '과도한 욕설');
insert into report (report_code, report_description) values ('R2', '음란물 배포');
insert into report (report_code, report_description) values ('R3', '스팸 또는 과도한 광고');
insert into report (report_code, report_description) values ('R4', '사기 행위');
insert into report (report_code, report_description) values ('R5', '부적절한 콘텐츠 게시');
insert into report (report_code, report_description) values ('R6', '개인정보 유출');
insert into report (report_code, report_description) values ('R7', '정치적 성향 강제');

insert into file_code (file_code, file_title) values ('F1', '프로필');
insert into file_code (file_code, file_title) values ('F2', '커뮤니티');
insert into file_code (file_code, file_title) values ('F3', '상품');
insert into file_code (file_code, file_title) values ('F4', '리뷰');
insert into file_code (file_code, file_title) values ('F5', '배너');
insert into file_code (file_code, file_title) values ('F6', '공지사항');
insert into file_code (file_code, file_title) values ('F7', '마이페이지배너');

commit;

-- 멤버 관련 - 5개
SELECT * FROM member;
SELECT * FROM grade;
SELECT * FROM role;
SELECT * FROM follow;
SELECT * FROM blacklist_reason;

-- 게시판 관련 - 16개
SELECT * FROM board;
SELECT * FROM board_image;
SELECT * FROM board_tag;
SELECT * FROM housing_type;
SELECT * FROM space_type;
SELECT * FROM area_size;
SELECT * FROM color;
SELECT * FROM board_book_mark;
SELECT * FROM board_like;
SELECT * FROM board_report;
SELECT * FROM comments;
SELECT * FROM comment_like;
SELECT * FROM comment_report;
SELECT * FROM reply;
SELECT * FROM reply_like;
SELECT * FROM reply_report;

-- 상품 관련 - 7개
SELECT * FROM product;
SELECT * FROM product_category;
SELECT * FROM product_like;
SELECT * FROM review;
SELECT * FROM review_like;
SELECT * FROM review_report;
SELECT * FROM review_image;

-- 결제 관련 - 12개
SELECT * FROM cart;
SELECT * FROM orders;
SELECT * FROM order_status;
SELECT * FROM order_list;
SELECT * FROM coupon;
SELECT * FROM coupon_owner;
SELECT * FROM payment;
SELECT * FROM payment_status;
SELECT * FROM return; 
SELECT * FROM return_status;  
SELECT * FROM point_history;

-- 관리자 관련 - 8개
SELECT * FROM notice;
SELECT * FROM faq;
SELECT * FROM event;
SELECT * FROM notice_code;
SELECT * FROM banner;
SELECT * FROM report;
SELECT * FROM files;
SELECT * FROM file_code;

-- 테이블 갯수 확인
SELECT table_name FROM user_tables;

-- 테이블 시퀸스 갯수 확인
SELECT sequence_name FROM user_sequences;