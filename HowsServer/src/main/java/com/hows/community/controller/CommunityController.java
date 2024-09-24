package com.hows.community.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hows.File.service.FileService; // FileService 클래스 import
import com.hows.common.CustomUserDetails;
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

	// 게시글 및 이미지/태그 저장 (트랜잭션 적용) 로그인 필요
	@PostMapping("/write-with-images")
	@Transactional // 트랜잭션 적용
	public ResponseEntity<Void> insertWriteWithImages(@RequestParam("housing_type_code") String housingTypeCode,
			@RequestParam("space_type_code") String spaceTypeCode, @RequestParam("area_size_code") String areaSizeCode,
			@RequestParam("board_contents") String boardContents, @RequestParam("member_id") String memberId,
			@RequestParam(value = "color_code", required = false) String colorCode, // 단일 color_code로 수정
			@RequestPart("files") MultipartFile[] files, // FormData에서 여러 이미지 파일을 받음
			@RequestParam("image_orders") int[] imageOrders, // 이미지 순서를 배열로 받음
			@RequestParam(value = "tags", required = false) String[] tagsJson, // 태그 데이터를 JSON 문자열 배열로 받음 (이미지 여러 개일 때)
			@RequestParam(value = "tag", required = false) String tagJson // 단일 태그 데이터 (이미지 하나일 때)
	) {
		try {
			// 1. CommunityDTO 객체 생성 및 게시글 저장
			CommunityDTO dto = new CommunityDTO();
			dto.setHousing_type_code(housingTypeCode);
			dto.setSpace_type_code(spaceTypeCode);
			dto.setArea_size_code(areaSizeCode);
			dto.setBoard_contents(boardContents);
			dto.setMember_id(memberId);
			dto.setColor_code(colorCode);
			System.out.println("컬러 코드 확인 " + colorCode);
			int boardSeq = communityServ.insertWrite(dto); // 게시글 저장
			System.out.println(boardSeq + " 게시글 시퀀스");

			// 2. 이미지 및 태그 저장 로직
			for (int i = 0; i < files.length; i++) {
				MultipartFile file = files[i];
				int imageOrder = imageOrders[i];

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
					String tags = (files.length > 1) ? tagsJson[i] : tagJson; // 이미지가 여러 개일 경우 tagsJson, 하나일 경우 tagJson
																				// 사용

					if (tags != null && !tags.isEmpty()) { // 태그가 있는지 확인
						List<TagDTO> tagsList = parseTagsFromJson(tags, boardImageSeq); // 태그 데이터를 이미지 시퀀스와 함께 파싱
						if (tagsList != null && !tagsList.isEmpty()) {
							for (TagDTO tag : tagsList) {
								tag.setBoard_image_seq(boardImageSeq);
								communityServ.insertTag(tag);
							}
						}
					} else {
						System.out.println("No tags for this image.");
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

	// 게시글 업데이트 로그인 필요
	@PutMapping("/update-with-images/{board_seq}")
	@Transactional
	public ResponseEntity<Void> updateWriteWithImages(@PathVariable int board_seq,
			@RequestParam("housing_type_code") String housingTypeCode,
			@RequestParam("space_type_code") String spaceTypeCode, @RequestParam("area_size_code") String areaSizeCode,
			@RequestParam("board_contents") String boardContents,
			@RequestParam(value = "color_code", required = false) String colorCode, // 단일 color_code로 수정
			@RequestParam("member_id") String memberId,
			@RequestParam("existing_image_urls") List<String> existingImageUrls,
			@RequestPart(value = "new_files", required = false) MultipartFile[] newFiles,
			@RequestParam(value = "new_image_orders", required = false) int[] newImageOrders,
			@RequestParam(value = "existing_image_orders", required = false) int[] existingImageOrders,
			@RequestParam Map<String, String> tagsMap // 각 이미지에 대한 태그를 Map으로 받음
	) {
		try {
			// 태그 JSON이 제대로 넘어오는지 확인
			System.out.println("Received tags JSON: " + tagsMap);

			// 1. 기존 이미지 URL 정보 조회
			List<String> currentImageURLs = communityServ.selectImagesUrls(board_seq);
			System.out.println("Current Images from DB: " + currentImageURLs);

			// 2. 클라이언트에서 넘어온 기존 이미지 목록 평탄화 작업
			List<String> flattenedExistingImageUrls = existingImageUrls.stream()
					.flatMap(url -> Arrays.stream(url.replaceAll("\\[|\\]|\"", "").split(", "))) // 이중 배열 평탄화
					.collect(Collectors.toList());

			System.out.println("Flattened Existing Image URLs: " + flattenedExistingImageUrls);

			// 3. 기존 이미지와 평탄화된 이미지 목록을 비교하여 삭제된 이미지 찾기
			List<String> deletedImages = new ArrayList<>();
			for (String currentImage : currentImageURLs) {
				if (!flattenedExistingImageUrls.contains(currentImage)) {
					deletedImages.add(currentImage); // 삭제된 이미지
				}
			}
			System.out.println("Images to delete: " + deletedImages);

			// 4. 삭제된 이미지가 있으면 GCS와 DB에서 삭제 처리 (GCS는 권한 이슈로 제외)
			for (String deletedImage : deletedImages) {
				String fileName = extractFileNameFromURL(deletedImage); // 파일명 추출 메서드 사용
				if (fileName != null) {
					// GCS 삭제는 남겨두되, 실제 삭제는 실행되지 않도록 함
					// DB에서 이미지 삭제 처리
					communityServ.deleteImage(deletedImage); // DB에서 이미지 삭제
					System.out.println("Deleted image from DB: " + deletedImage);
				}
			}

			// 5. 기존 이미지 순서 및 태그 업데이트 (중복 방지 및 삭제/추가/업데이트 로직 추가)
			if (existingImageOrders != null) {
			    for (int i = 0; i < flattenedExistingImageUrls.size(); i++) {
			        String existingImageUrl = flattenedExistingImageUrls.get(i);
			        int imageOrder = existingImageOrders[i];

			        System.out.println("Processing existing image URL: " + existingImageUrl + " with order: " + imageOrder);

			        // DB에서 이미지 URL로 board_image_seq 조회
			        int boardImageSeq = communityServ.selectBoardImageSeqByUrl(existingImageUrl);
			        communityServ.updateImageOrder(existingImageUrl, imageOrder);
			        System.out.println("Updated image order for image: " + existingImageUrl + " to order: " + imageOrder);

			        // 기존 이미지에 대한 태그 처리
			        String tagsJson = tagsMap.get("tags_json_" + i);
			        System.out.println("Received tags JSON for existing image " + i + ": " + tagsJson);

			        if (tagsJson != null) {
			            List<TagDTO> newTagsList = parseTagsFromJson(tagsJson, boardImageSeq);
			            System.out.println("Parsed tags for existing image " + i + ": " + newTagsList);

			            // 1) 기존 태그 조회
			            List<TagDTO> existingTags = communityServ.selectTagsByImageSeq(boardImageSeq);

			            // 2) 삭제할 태그 찾기
			            for (TagDTO existingTag : existingTags) {
			                boolean isDeleted = newTagsList.stream()
			                        .noneMatch(newTag -> newTag.getProduct_seq() == existingTag.getProduct_seq()
			                                && newTag.getLeft_position() == existingTag.getLeft_position()
			                                && newTag.getTop_position() == existingTag.getTop_position());
			                if (isDeleted) {
			                    communityServ.deleteTag(existingTag.getBoard_tag_seq());
			                    System.out.println("Deleted tag: " + existingTag);
			                }
			            }

			            // 3) 새로운 태그 추가
			            for (TagDTO newTag : newTagsList) {
			                boolean isDuplicate = existingTags.stream()
			                        .anyMatch(existingTag -> existingTag.getProduct_seq() == newTag.getProduct_seq()
			                                && existingTag.getLeft_position() == newTag.getLeft_position()
			                                && existingTag.getTop_position() == newTag.getTop_position());

			                if (!isDuplicate) {
			                    newTag.setBoard_image_seq(boardImageSeq); // 기존 이미지의 시퀀스 설정
			                    communityServ.insertTag(newTag); // 중복이 아니면 태그 저장
			                    System.out.println("Added new tag: " + newTag);
			                }
			            }
			        }
			    }
			}

			// 6. 새로 추가된 이미지 처리 (기존 이미지 개수만큼 오프셋 추가)
			int newImageIndexOffset = flattenedExistingImageUrls.size();
			if (newFiles != null && newFiles.length > 0) {
			    for (int i = 0; i < newFiles.length; i++) {
			        MultipartFile file = newFiles[i];
			        int imageOrder = newImageOrders[i];

			        System.out.println("Uploading new image file: " + file.getOriginalFilename() + " with order: " + imageOrder);

			        // 이미지 업로드
			        String uploadResult = fileServ.upload(file, board_seq, "F2");
			        System.out.println("Upload result for new image: " + uploadResult);

			        if (!uploadResult.equals("fail")) {
			            // 새 이미지 DB 저장
			            ImageDTO imageDTO = new ImageDTO();
			            imageDTO.setBoard_seq(board_seq);
			            imageDTO.setImage_url(uploadResult);
			            imageDTO.setImage_order(imageOrder);
			            int boardImageSeq = communityServ.insertImage(imageDTO);
			            System.out.println("Saved new image with board_image_seq: " + boardImageSeq);

			            // 태그 데이터 처리 (오프셋 추가 후 인덱스 처리)
			            String tagsJson = tagsMap.get("tags_json_" + (newImageIndexOffset + i));
			            System.out.println("Received tags JSON for new image " + i + ": " + tagsJson);

			            if (tagsJson != null && !tagsJson.isEmpty()) {
			                List<TagDTO> tagsList = parseTagsFromJson(tagsJson, boardImageSeq);
			                System.out.println("Parsed tags for new image " + i + ": " + tagsList);

			                if (tagsList != null && !tagsList.isEmpty()) {
			                    for (TagDTO tag : tagsList) {
			                        tag.setBoard_image_seq(boardImageSeq);
			                        communityServ.insertTag(tag);
			                        System.out.println("Saved new tag for image " + i + ": " + tag);
			                    }
			                }
			            }
			        } else {
			            System.out.println("Image upload failed for new image " + i);
			        }
			    }
			}
			System.out.println(colorCode + " 컬러코드 갑 확인");
			// 7. 게시글 내용 업데이트
			CommunityDTO dto = new CommunityDTO();
			dto.setHousing_type_code(housingTypeCode);
			dto.setSpace_type_code(spaceTypeCode);
			dto.setArea_size_code(areaSizeCode);
			dto.setBoard_contents(boardContents);
			dto.setColor_code(colorCode);
			dto.setMember_id(memberId);
			dto.setBoard_seq(board_seq);
			communityServ.updateWrite(dto); // 게시글 업데이트

			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("게시글 업데이트 또는 이미지 처리 실패", e);
		}
	}

	// 태그 데이터를 JSON에서 List<TagDTO>로 파싱하는 메서드
	private List<TagDTO> parseTagsFromJson(String tagsJson, int boardImageSeq) throws IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		List<TagDTO> tags = new ArrayList<>();

		if (tagsJson == null || tagsJson.isEmpty()) {
			System.out.println("태그 데이터가 없습니다.");
			return tags; // 빈 리스트 반환
		}

		try {
			// JSON을 파싱하여 TagDTO 리스트로 변환
			tags = objectMapper.readValue(tagsJson, new TypeReference<List<TagDTO>>() {
			});
			System.out.println("파싱된 태그 데이터: " + tags);
		} catch (JsonMappingException e) {
			System.err.println("태그 JSON 파싱 오류: " + e.getMessage());
			throw new IOException("태그 데이터를 처리하는 중 오류가 발생했습니다.", e);
		} catch (JsonProcessingException e) {
			System.err.println("JSON 처리 중 오류 발생: " + e.getMessage());
			throw new IOException("태그 데이터를 처리하는 중 오류가 발생했습니다.", e);
		}

		// 각 태그에 이미지 시퀀스 추가
		for (TagDTO tag : tags) {
			tag.setBoard_image_seq(boardImageSeq);
		}

		return tags;
	}

	// 커뮤니티 게시글 불러오는 메서드 로그인 없어도 됌
	@GetMapping
	public ResponseEntity<List<Map<String, Object>>> selectAll(
			@RequestParam(value = "member_id", required = false) String memberId,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "sort", required = false) String sort,
			@RequestParam(value = "housingType", required = false) String housingType,
			@RequestParam(value = "spaceType", required = false) String spaceType,
			@RequestParam(value = "areaSize", required = false) String areaSize,
			@RequestParam(value = "color", required = false) String color,
			@RequestParam(value = "page", required = false, defaultValue = "1") int page,
			@RequestParam(value = "limit", required = false, defaultValue = "20") int limit) {

		// 게시글 리스트 가져오기
		List<Map<String, Object>> list = communityServ.selectCommunityPosts(page, limit, keyword, sort, housingType,
				spaceType, areaSize, color);

		// 이미지 가져오기 및 맵핑
		List<Map<String, Object>> listImg = communityServ.selectAllImg();
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

		// 게시글에 이미지 및 좋아요/북마크 상태 추가
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

	// 커뮤니티 좋아요 로그인 필요
	@PostMapping("{board_seq}/like")
	public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable int board_seq,
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
				response.put("isLiked", false); // 좋아요가 취소되었으므로 false
				response.put("message", "좋아요가 취소되었습니다.");
			} else {
				// 3. 좋아요 추가
				communityServ.addLike(userId, board_seq);
				response.put("isLiked", true); // 좋아요가 추가되었으므로 true
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

	// 커뮤니티 북마크 로그인 필요
	@PostMapping("{board_seq}/bookmark")
	public ResponseEntity<Map<String, Object>> toggleBookmark(@PathVariable int board_seq,
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
				response.put("isBookmarked", false); // 북마크가 취소되었으므로 false
				response.put("message", "북마크가 취소되었습니다.");
			} else {
				// 3. 북마크 추가
				communityServ.addBookmark(userId, board_seq);
				response.put("isBookmarked", true); // 북마크가 추가되었으므로 true
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

	// 커뮤니티 디테일 로그인 필요없음
	@GetMapping("/{board_seq}")
	public ResponseEntity<Map<String, Object>> selectAllSeq(@PathVariable int board_seq,
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

	// 이미지 태그정보
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

	// 태그정보
	@GetMapping("/tags/{board_seq}")
	public ResponseEntity<List<Map<String, Object>>> selectTags(@PathVariable int board_seq) {
		List<Map<String, Object>> list = communityServ.selectTagsAndProductInfo(board_seq);
		return ResponseEntity.ok(list);
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

	// 게시글 신고처리
	@PostMapping("/report")
	public ResponseEntity<Void> sendReport(@RequestBody Map<String, Object> reportData) {
		int boardSeq = Integer.parseInt((String) reportData.get("board_seq"));
		String reportCode = (String) reportData.get("report_code");
		String memberId = (String) reportData.get("member_id");
		communityServ.sendReport(boardSeq, reportCode, memberId);
		System.out.println(boardSeq + "_확인");
		System.out.println(reportCode + "_확인");

		return ResponseEntity.ok().build();
	}

	// 사용자 구매내역
	@GetMapping("/purchaseHistory")
	public ResponseEntity<List<Map<String, Object>>> purchaseHistory(@AuthenticationPrincipal CustomUserDetails user)
			throws Exception {
		int member_seq = user.getMemberSeq();
		List<Map<String, Object>> list = communityServ.purchaseHistory(member_seq);
		return ResponseEntity.ok(list);
	}

	// 관리자
	// 게시물 신고 조회 (관리자)
	@GetMapping("/reportedCommunity")
	public ResponseEntity<Map<String, Object>> reportedCommunity(@RequestParam int startRow, @RequestParam int endRow)
			throws Exception {

		// 파라미터 맵 생성
		Map<String, Object> params = new HashMap<>();
		params.put("startRow", startRow);
		params.put("endRow", endRow);

		// 전체 신고된 게시물 카운트
		int totalCount = communityServ.getReportedCommunityCount(params);

		// 페이징된 게시물 신고 목록 조회
		List<Map<String, Object>> reportedBoards = communityServ.reportedCommunity(params);

		// 응답 데이터 구성
		Map<String, Object> response = new HashMap<>();
		response.put("totalCount", totalCount);
		response.put("boards", reportedBoards);

		return ResponseEntity.ok(response);
	}

	// 게시물 신고내역 조회 (관리자)
	@GetMapping("/communityReport/{board_seq}")
	public ResponseEntity<List<BoardReportDTO>> CommunityReport(@PathVariable int board_seq) throws Exception {
		List<BoardReportDTO> boardReports = communityServ.CommunityReport(board_seq);
		return ResponseEntity.ok(boardReports);
	}

	// 신고 게시물 삭제 (관리자)
	@DeleteMapping("/deleteCommunity/{board_seq}")
	public ResponseEntity<Integer> deleteCommunity(@PathVariable int board_seq) throws Exception {
		try {
			// 1. 게시글과 연관된 이미지 파일들 가져오기
			List<String> fileURLs = communityServ.getFileURLsForBoard(board_seq);

			// 2. GCS에서 파일 삭제
			for (String fileURL : fileURLs) {
				String fileName = extractFileNameFromURL(fileURL);
				System.out.println(fileName);
				String deleteResult = fileServ.deleteFile(fileName, "F2"); // 적절한 code 전달

				if ("success".equals(deleteResult)) {
					System.out.println("GCS 파일 삭제 성공: " + fileName);
				} else {
					System.out.println("GCS 파일 삭제 실패: " + fileName);
				}
			}

			// 3. 게시글 삭제
			int result = communityServ.deleteCommunity(board_seq);

			if (result > 0) {
				return ResponseEntity.ok(result); // 성공 시 200 OK와 삭제된 행 수 반환
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(0); // 삭제 실패 시 404 NOT FOUND
			}

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0); // 에러 발생 시 500 에러 반환
		}
	}

	// 이미지 제거를 위한 sysname뽑아오는 로직
	public String extractFileNameFromURL(String fileURL) {
		if (fileURL == null || fileURL.isEmpty()) {
			System.out.println("파일 URL이 null이거나 비어있습니다.");
			return null;
		}
		// 마지막 슬래시 뒤에 있는 파일명만 추출
		return fileURL.substring(fileURL.lastIndexOf("/") + 1);
	}

	// 카테고리 별 게시글 수 조회 (관리자)
	@GetMapping("/getBoardNumByCategory")
	public ResponseEntity<Map<String, Object>> getBoardNumByCategory() throws Exception {
		Map<String, Object> result = communityServ.getBoardNumByCategory();
		return ResponseEntity.ok(result);
	}

	// 오늘 작성된 게시글 수 조회 (관리자)
	@GetMapping("/todayBoardNum")
	public ResponseEntity<Integer> todayBoardNum() throws Exception {
		int result = communityServ.todayBoardNum();
		return ResponseEntity.ok(result);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> exceptionHandler(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body("fail");
	}
}
