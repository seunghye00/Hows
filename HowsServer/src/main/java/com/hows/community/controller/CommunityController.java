package com.hows.community.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hows.File.service.FileService; // FileService 클래스 import
import com.hows.community.dto.BoardReportDTO;
import com.hows.community.dto.CommunityDTO; // CommunityDTO import
import com.hows.community.dto.ImageDTO; // ImageDTO import
import com.hows.community.dto.TagDTO; // TagDTO import
import com.hows.community.service.CommunityService; // CommunityService import
import com.hows.member.dto.MemberDTO;
import com.hows.member.service.MemberService;

@RestController
@RequestMapping("/community")
public class CommunityController {
	@Autowired
	private CommunityService communityServ;

	@Autowired
	private FileService fileServ;

	@Autowired
	private MemberService memServ;
	
	// 게시글 및 이미지/태그 저장 (트랜잭션 적용)
	// 게시글 및 이미지/태그 저장 (트랜잭션 적용)
    @PostMapping("/write-with-images")
    @Transactional // 트랜잭션 적용
    public ResponseEntity<Void> insertWriteWithImages(
        @RequestParam("housing_type_code") String housingTypeCode,
        @RequestParam("space_type_code") String spaceTypeCode,
        @RequestParam("area_size_code") String areaSizeCode,
        @RequestParam("board_contents") String boardContents,
        @RequestParam("member_id") String memberId,
        @RequestPart("files") MultipartFile[] files,  // FormData에서 여러 이미지 파일을 받음
        @RequestParam("image_orders") int[] imageOrders,  // 이미지 순서를 배열로 받음
        @RequestParam("tags") String[] tagsJson  // 태그 데이터를 JSON 문자열 배열로 받음
    ) {
        try {
            // 1. CommunityDTO 객체 생성 및 게시글 저장
            CommunityDTO dto = new CommunityDTO();
            dto.setHousing_type_code(housingTypeCode);
            dto.setSpace_type_code(spaceTypeCode);
            dto.setArea_size_code(areaSizeCode);
            dto.setBoard_contents(boardContents);
            dto.setMember_id(memberId);
            
            int boardSeq = communityServ.insertWrite(dto); // 게시글 저장
            System.out.println(boardSeq + " 게시글 시퀀스");

            // 2. 이미지 및 태그 저장 로직
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                int imageOrder = imageOrders[i];
                String tags = tagsJson[i];

                // 이미지 업로드
                String code = "F2"; 
                String uploadResult = fileServ.upload(file, boardSeq, code); 
                System.out.println(uploadResult + " 업로드 결과 확인");

                if (!uploadResult.equals("fail")) {
                    // 이미지 DB 저장
                    ImageDTO imageDTO = new ImageDTO();
                    imageDTO.setBoard_seq(boardSeq);
                    imageDTO.setImage_url(uploadResult);
                    imageDTO.setImage_order(imageOrder);
                    int boardImageSeq = communityServ.insertImage(imageDTO);

                    // 태그 데이터 처리
                    List<TagDTO> tagsList = parseTagsFromJson(tags, boardImageSeq);
                    if (tagsList != null && !tagsList.isEmpty()) {
                        for (TagDTO tag : tagsList) {
                            tag.setBoard_image_seq(boardImageSeq);
                            communityServ.insertTag(tag);
                        }
                    }
                } else {
                    throw new IOException("이미지 업로드 실패");
                }
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("게시글 작성 또는 이미지 업로드 실패", e);
        }
    }

	// 태그 데이터를 JSON에서 List<TagDTO>로 파싱하는 메서드
	private List<TagDTO> parseTagsFromJson(String tagsJson, int board_image_seq) throws IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		List<TagDTO> tags = objectMapper.readValue(tagsJson, new TypeReference<List<TagDTO>>() {
		});

		// 각 태그에 이미지 시퀀스 추가
		for (TagDTO tag : tags) {
			tag.setBoard_image_seq(board_image_seq);
		}
		return tags;
	}

	// 커뮤니티 게시글 불러오는 메서드
	@GetMapping
	public ResponseEntity<List<Map<String, Object>>> selectAll(
	        @RequestParam(value = "member_id", required = false) String memberId) {

	    // 게시글 리스트 가져오기
	    List<Map<String, Object>> list = communityServ.selectAll();
	    List<Map<String, Object>> listImg = communityServ.selectAllImg();

	    // 이미지 맵핑
	    Map<Integer, List<String>> imageMap = new HashMap<>();
	    for (Map<String, Object> imgData : listImg) {
	        BigDecimal boardSeqDecimal = (BigDecimal) imgData.get("BOARD_SEQ");
	        Integer boardSeq = boardSeqDecimal != null ? boardSeqDecimal.intValue() : null;
	        String imageUrl = (String) imgData.get("IMAGE_URL");

	        if (imageUrl != null) {
	            imageMap.putIfAbsent(boardSeq, new ArrayList<>());
	            imageMap.get(boardSeq).add(imageUrl);
	        }
	    }

	    // 각 게시글에 이미지 및 좋아요/북마크 상태 추가
	    for (Map<String, Object> boardData : list) {
	        BigDecimal boardSeqDecimal = (BigDecimal) boardData.get("BOARD_SEQ");
	        Integer boardSeq = boardSeqDecimal != null ? boardSeqDecimal.intValue() : null;
	        List<String> images = imageMap.getOrDefault(boardSeq, new ArrayList<>());
	        boardData.put("images", images);

	        if (memberId != null) {
	            // 로그인한 사용자의 SEQ 가져오기
	            MemberDTO fromMemberInfo = memServ.selectInfo(memberId);
	            int fromMemberSeq = fromMemberInfo.getMember_seq(); // 로그인한 사용자의 member_seq

	            // 게시글 작성자의 MEMBER_SEQ 가져오기
	            BigDecimal toMemberSeqDecimal = (BigDecimal) boardData.get("MEMBER_SEQ");
	            Integer toMemberSeq = toMemberSeqDecimal != null ? toMemberSeqDecimal.intValue() : null;

	            // 회원일 경우 좋아요 및 북마크 상태 추가
	            boolean isFollowing = memServ.checkIfUserFollowing(fromMemberSeq, toMemberSeq);
	            boolean isLiked = communityServ.checkIfUserLikedBoard(memberId, boardSeq);
	            boolean isBookmarked = communityServ.checkIfUserBookmarkedBoard(memberId, boardSeq);
	            boardData.put("isLiked", isLiked);
	            boardData.put("isFollowing", isFollowing);
	            boardData.put("isBookmarked", isBookmarked);
	        } else {
	            // 비회원일 경우 기본 값 설정
	            boardData.put("isLiked", false);
	            boardData.put("isFollowing", false);
	            boardData.put("isBookmarked", false);
	        }
	    }

	    return ResponseEntity.ok(list);
	}
    
    //커뮤니티 좋아요
    @PostMapping("{board_seq}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable int board_seq,
            @RequestBody Map<String, Object> requestBody // member_id를 body에서 받음
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = (String) requestBody.get("member_id"); // member_id 가져오기
            System.out.println(userId + " 진입 확인");
            
            // 1. 사용자가 이미 좋아요를 눌렀는지 확인
            boolean isLiked = communityServ.checkIfUserLikedBoard(userId, board_seq);

            if (isLiked) {
                // 2. 이미 좋아요를 눌렀다면 좋아요 취소
                communityServ.removeLike(userId, board_seq);
                response.put("isLiked", false);  // 좋아요가 취소되었으므로 false
                response.put("message", "좋아요가 취소되었습니다.");
            } else {
                // 3. 좋아요 추가
                communityServ.addLike(userId, board_seq);
                response.put("isLiked", true);  // 좋아요가 추가되었으므로 true
                response.put("message", "좋아요가 추가되었습니다.");
            }

            // 4. 좋아요 수 업데이트 후 반환
            int likeCount = communityServ.getLikeCount(board_seq);
            response.put("like_count", likeCount);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "좋아요 처리 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    //커뮤니티 북마크
    @PostMapping("{board_seq}/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(
            @PathVariable int board_seq,
            @RequestBody Map<String, Object> requestBody // member_id를 body에서 받음
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = (String) requestBody.get("member_id"); // member_id 가져오기
            System.out.println(userId + " 북마크 진입 확인");

            // 1. 사용자가 이미 북마크를 눌렀는지 확인
            boolean isBookmarked = communityServ.checkIfUserBookmarkedBoard(userId, board_seq);

            if (isBookmarked) {
                // 2. 이미 북마크를 눌렀다면 북마크 취소
                communityServ.removeBookmark(userId, board_seq);
                response.put("isBookmarked", false);  // 북마크가 취소되었으므로 false
                response.put("message", "북마크가 취소되었습니다.");
            } else {
                // 3. 북마크 추가
                communityServ.addBookmark(userId, board_seq);
                response.put("isBookmarked", true);  // 북마크가 추가되었으므로 true
                response.put("message", "북마크가 추가되었습니다.");
            }

            // 4. 북마크 수 업데이트 후 반환
            int bookmarkCount = communityServ.getBookmarkCount(board_seq);
            response.put("bookmark_count", bookmarkCount);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "북마크 처리 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
	// 커뮤니티 디테일
    @GetMapping("/{board_seq}")
    public ResponseEntity<Map<String, Object>> selectAllSeq(
        @PathVariable int board_seq,
        @RequestParam(value = "member_id", required = false) String memberId) {

        // 게시글 정보 가져오기
        Map<String, Object> boardDetail = communityServ.selectAllSeq(board_seq);

        // 비회원일 경우 좋아요 및 북마크 기본 값 설정
        boolean isLiked = false;
        boolean isBookmarked = false;

        if (memberId != null) {
            // 회원일 경우 좋아요 및 북마크 상태 확인
            isLiked = communityServ.checkIfUserLikedBoard(memberId, board_seq);
            isBookmarked = communityServ.checkIfUserBookmarkedBoard(memberId, board_seq);
        }

        boardDetail.put("isLiked", isLiked);
        boardDetail.put("isBookmarked", isBookmarked);

        return ResponseEntity.ok(boardDetail);
    }

	@GetMapping("/images/{board_seq}")
	public ResponseEntity<Map<String, Object>> selectImagesAndTags(@PathVariable int board_seq) {
		List<Map<String, Object>> images = communityServ.selectImages(board_seq);
		List<Map<String, Object>> tags = communityServ.selectTagsAndProductInfo(board_seq);

		// 이미지와 태그 데이터를 하나의 맵으로 합침
		Map<String, Object> result = new HashMap<>();
		result.put("images", images);
		result.put("tags", tags);

		return ResponseEntity.ok(result);
	}

	// 조회수 증가 메서드
	@PostMapping("/{board_seq}/increment-view")
	public ResponseEntity<Integer> incrementViewCount(@PathVariable int board_seq) {
	    try {
	        // 조회수 증가 로직 호출
	        communityServ.incrementViewCount(board_seq);
	        
	        // 업데이트된 조회수를 가져오기
	        int updatedViewCount = communityServ.getViewCount(board_seq);
	        
	        return ResponseEntity.ok(updatedViewCount); // 조회수를 클라이언트에 반환
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
	// 관리자
	// 게시물 신고 조회 (관리자)
	@GetMapping("/reportedCommunity")
	public ResponseEntity<Map<String, Object>> reportedCommunity(@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int itemsPerPage) throws Exception {
		// 전체 신고된 게시물 카운트
		int totalCount = communityServ.getReportedCommunityCount();

		// 페이징된 게시물 신고 목록 조회
		List<Map<String, Object>> reportedBoards = communityServ.reportedCommunity(page, itemsPerPage);
		System.out.println("컨트롤러 :" + reportedBoards);

		// 페이징 정보와 게시물 목록을 함께 반환
		Map<String, Object> response = new HashMap<>();
		response.put("totalCount", totalCount);
		response.put("boards", reportedBoards);

		return ResponseEntity.ok(response);
	}

	// 게시물 내역 조회 (관리자)
	@GetMapping("/communityReport/{board_seq}")
	public ResponseEntity<List<BoardReportDTO>> CommunityReport(@PathVariable int board_seq) throws Exception {
		List<BoardReportDTO> boardReports = communityServ.CommunityReport(board_seq);
		return ResponseEntity.ok(boardReports);
	}

	// 신고 게시물 삭제 (관리자)
	@DeleteMapping("/deleteCommunity/{board_seq}")
	public ResponseEntity<Integer> deleteCommunity(@PathVariable int board_seq) throws Exception {
		int result = communityServ.deleteCommunity(board_seq);

		if (result > 0) {
			return ResponseEntity.ok(result); // 성공 시 200 OK와 삭제된 행 수 반환
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(0); // 삭제 실패 시 404 NOT FOUND
		}
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
}
