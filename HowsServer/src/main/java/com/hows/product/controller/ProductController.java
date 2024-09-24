package com.hows.product.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hows.File.service.FileService;
import com.hows.product.dto.ImageDTO;
import com.hows.product.dto.ProductDTO;
import com.hows.product.dto.ReviewDTO;
import com.hows.product.dto.ReviewReportDTO;
import com.hows.product.service.ProductService;
import com.hows.product.service.ReviewService;

@RestController
@RequestMapping("/product")
public class ProductController {

	@Autowired
	private ProductService productServ;

	@Autowired
	private ReviewService reviewServ;

	@Autowired
	private FileService fileServ;

	// 상품 '베스트' 목록 출력
	@GetMapping("/getBestProducts")
	public ResponseEntity<List<ProductDTO>> getBestProducts() throws Exception {
		List<ProductDTO> bestProducts = productServ.getBestProducts();
		return ResponseEntity.ok(bestProducts);
	}

	// 상품 랜덤으로 '전체' 목록 출력
	@GetMapping
	public ResponseEntity<List<ProductDTO>> getProducts() throws Exception {
		List<ProductDTO> products = productServ.getProducts();
		return ResponseEntity.ok(products);
	}

	// 상품 리뷰 많은순 목록 출력
	@GetMapping("/getProductBytReview")
	public ResponseEntity<List<ProductDTO>> getProductBytReview() throws Exception {
		List<ProductDTO> products = productServ.getProductBytReview();
		return ResponseEntity.ok(products);
	}

	// 상품 '카테고리'별 목록 출력
	@GetMapping("/category/{product_category_code}")
	public ResponseEntity<List<Map<String, Object>>> getProductByCategory(@PathVariable String product_category_code)
			throws Exception {
		List<Map<String, Object>> products = productServ.getProductByCategory(product_category_code);
		return ResponseEntity.ok(products);
	}

	// 상품 '디테일' 출력
	@GetMapping("/detail/{product_seq}")
	public ResponseEntity<ProductDTO> getProductByDetail(@PathVariable String product_seq) throws Exception {
		ProductDTO detaile = productServ.getProductByDetail(product_seq);
		return ResponseEntity.ok(detaile);
	}

	// 사용자 구매 확정 여부 확인, 로그인 필요함
	@GetMapping("/review/checkPurchaseStatus")
	public ResponseEntity<Boolean> checkPurchaseStatus(@RequestParam String memberId, @RequestParam int productSeq)
			throws Exception {

		boolean isPurchased = reviewServ.checkPurchaseStatus(memberId, productSeq);
		return ResponseEntity.ok(isPurchased);
	}

	// 구매 여부 및 이미 리뷰를 작성했는지 확인, 로그인 필요함
	@GetMapping("/review/canWriteReview")
	public ResponseEntity<Boolean> canWriteReview(@RequestParam String memberId, @RequestParam int productSeq)
			throws Exception {

		boolean canWriteReview = reviewServ.canWriteReview(memberId, productSeq);
		return ResponseEntity.ok(canWriteReview);
	}

	// 리뷰 수정, 로그인 필요함
	@PostMapping("/reviewMod")
	@Transactional
	public ResponseEntity<String> modReview(
			@RequestParam(value = "existImages", required = false) List<String> existImages, // 기존 GCS 이미지 URL
			@RequestParam(value = "newImages", required = false) MultipartFile[] newImages, // 새로 업로드된 이미지 파일
			@RequestParam("reviewData") String reviewData,
			@RequestParam(value = "imageOrders", required = false) int[] imageOrders) throws Exception {

		ObjectMapper mapper = new ObjectMapper();

		try {
			// JSON 형식의 리뷰 데이터 추출
			JsonNode jsonNode = mapper.readTree(reviewData);

			int review_seq = jsonNode.get("review_seq").asInt();
			int rating = jsonNode.get("rating").asInt();
			String review_contents = jsonNode.get("review_contents").asText();
			String memberId = jsonNode.get("member_id").asText();
			int productSeq = jsonNode.get("product_seq").asInt();

			// 기존 이미지 갱신
			List<Map<String, String>> imgList = reviewServ.getReviewImgList(review_seq);
			for (Map<String, String> image : imgList) {
				if (existImages == null || !existImages.contains(image.get("IMAGE_URL"))) {
					// DB에 있는 이미지가 목록에 포함이 안되어 있으면 제거
					if (image == null)
						continue;

					String imageURL = image.get("IMAGE_URL");
					System.out.println("i url : " + image);

					String fileName = imageURL.substring(imageURL.lastIndexOf('/') + 1); // URL에서 파일 이름 추출
					String deleteResult = fileServ.deleteFile(fileName, "F4"); // 적절한 코드 사용

					if ("ok".equals(deleteResult)) {
						System.out.println("GCS 이미지 삭제 성공: " + fileName);
					} else {
						System.out.println("GCS 이미지 삭제 실패: " + fileName);
					}

					reviewServ.delReviewImage(image.get("IMAGE_URL"));
				}
			}

			// 새로운 이미지 등록 (리뷰 등록과 동일함)
			if (newImages != null && newImages.length > 0) {
				for (int i = 0; i < newImages.length; i++) {
					String imageUrl = fileServ.upload(newImages[i], productSeq, "F4");

					// System.out.println(imageUrl + " : " + review_seq);
					// imageUrl : GCS에 등록된 이미지 URL
					// review_image 테이블에 등록
					if (!imageUrl.equals("fail")) {
						ImageDTO imageDTO = new ImageDTO(0, review_seq, imageUrl, imageOrders[i]);
						reviewServ.insertReviewImage(imageDTO);
					}
				}
			}

			// 리뷰 업데이트
			reviewServ.updateReview(review_seq, rating, review_contents);

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("리뷰 수정 중 오류 발생", e);
		}

		return ResponseEntity.ok().build();
	}

	// 리뷰 등록, 로그인 필요함
	@PostMapping("/reviewAdd")
	@Transactional
	public ResponseEntity<String> submitReview(@RequestParam("images") MultipartFile[] images, // 여러 이미지 파일
			@RequestParam("reviewData") String reviewData, @RequestParam("image_orders") int[] imageOrders)
			throws Exception {
		// System.out.println("images : " + images);

		ObjectMapper mapper = new ObjectMapper();
		try {
			// JSON 형식의 리뷰 데이터 추출
			JsonNode jsonNode = mapper.readTree(reviewData);

			int rating = jsonNode.get("rating").asInt();
			String reviewText = jsonNode.get("review_contents").asText();
			int productSeq = jsonNode.get("product_seq").asInt();
			String memberId = jsonNode.get("member_id").asText();

			// 리뷰 저장
			int reviewSeq = reviewServ.saveReview(rating, reviewText, productSeq, memberId);

			// 이미지 파일 처리
			if (images != null && images.length > 0) {
				for (int i = 0; i < images.length; i++) {
					String imageUrl = fileServ.upload(images[i], productSeq, "F4");

					// System.out.println(imageUrl + " 결과");
					// imageUrl : GCS에 등록된 이미지 URL
					// review_image 테이블에 등록
					if (!imageUrl.equals("fail")) {
						ImageDTO imageDTO = new ImageDTO(0, reviewSeq, imageUrl, imageOrders[i]);
						reviewServ.insertReviewImage(imageDTO);
					}
				}
			} else {
				throw new IOException("이미지 업로드 실패");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("리뷰등록 또는 이미지 업로드 실패", e);
		}
		return ResponseEntity.ok().build();
	}

	// 리뷰 이미지 가져오기, 로그인 필요함
	@GetMapping("/getReviewImgList/{review_seq}")
	public ResponseEntity<Map<String, Object>> getReviewImgList(@PathVariable int review_seq,
			@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int itemsPerPage)
			throws Exception {

		// 페이징된 리뷰 목록 조회
		List<Map<String, String>> reviewImgList = reviewServ.getReviewImgList(review_seq);

		// 페이징 정보와 리뷰 목록을 함께 반환
		Map<String, Object> response = new HashMap<>();
		response.put("reviewImgs", reviewImgList);

		return ResponseEntity.ok(response);
	}

	// 리뷰 목록 출력 (페이징)
	@GetMapping("/getReviewList/{product_seq}")
	public ResponseEntity<Map<String, Object>> getReviewList(@PathVariable int product_seq,
			@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int itemsPerPage)
			throws Exception {

		// 페이징된 리뷰 목록 조회
		List<Map<String, Object>> reviewList = reviewServ.getReviewList(product_seq, page, itemsPerPage);

		// 페이징 정보와 리뷰 목록을 함께 반환
		Map<String, Object> response = new HashMap<>();
		response.put("reviews", reviewList);

		return ResponseEntity.ok(response);
	}

	// 리뷰 best (좋아요) 순 출력
	@GetMapping("/getReviewListByBest/{product_seq}")
	public ResponseEntity<Map<String, Object>> getReviewListByBest(@PathVariable int product_seq,
			@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int itemsPerPage)
			throws Exception {

		// 페이징된 리뷰 목록 조회
		List<Map<String, Object>> reviewList = reviewServ.getReviewListByBest(product_seq, page, itemsPerPage);

		// 페이징 정보와 리뷰 목록을 함께 반환
		Map<String, Object> response = new HashMap<>();
		response.put("reviews", reviewList);

		return ResponseEntity.ok(response);
	}

	// 리뷰 삭제, 로그인 필요함
	@Transactional
	@DeleteMapping("/delReview/{review_seq}")
	public ResponseEntity<String> delReview(@PathVariable int review_seq) throws Exception {
//	    reviewServ.deleteReview(review_seq);
//	    return ResponseEntity.ok().build();

		try {
			// 1. 리뷰와 연관된 이미지 파일 URL들 가져오기
			List<Map<String, String>> imageList = reviewServ.getReviewImgList(review_seq);

			// 2. GCS에서 이미지 파일 삭제
			for (Map<String, String> image : imageList) {
				if (image == null)
					continue;

				String imageURL = image.get("IMAGE_URL");
				System.out.println("i url : " + image);

				String fileName = imageURL.substring(imageURL.lastIndexOf('/') + 1); // URL에서 파일 이름 추출
				String deleteResult = fileServ.deleteFile(fileName, "F4"); // 적절한 코드 사용

				if ("ok".equals(deleteResult)) {
					System.out.println("GCS 이미지 삭제 성공: " + fileName);
				} else {
					System.out.println("GCS 이미지 삭제 실패: " + fileName);
				}

				// 3. DB에서 이미지 정보 삭제
				reviewServ.delReviewImage(imageURL);
			}

			// 3. 리뷰 삭제
			reviewServ.deleteReview(review_seq);

			return ResponseEntity.ok("리뷰 및 이미지 삭제 완료"); // 성공 시 응답

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("리뷰 삭제 중 오류 발생"); // 에러 시 응답
		}
	}

	// 리뷰 신고, 로그인 필요함
	@Transactional
	@PostMapping("/review/report")
	public ResponseEntity<Void> sendReviewReport(@RequestBody Map<String, Object> reportData) throws Exception {
		int review_seq = (Integer) reportData.get("review_seq");
		String report_code = (String) reportData.get("report_code");
		String member_id = (String) reportData.get("member_id");

		// System.out.println("review_seq=" + review_seq + ", report_code=" +
		// report_code + ", member_id=" + member_id);
		if (report_code == null || report_code.length() > 2) {
			return ResponseEntity.badRequest().build(); // 잘못된 요청 반환
		}

		reviewServ.sendReviewReport(review_seq, report_code, member_id);
		return ResponseEntity.ok().build();
	}

	// 리뷰 전체 별점
	@GetMapping("/review/getRatings/{product_seq}")
	public ResponseEntity<List<ReviewDTO>> getRatings(@PathVariable int product_seq) throws Exception {
		List<ReviewDTO> result = reviewServ.getRatings(product_seq);
		return ResponseEntity.ok(result);
	}

	// 관리자
	// 카테고리별 상품 수 조회
	@GetMapping("/getProductNumByCategory")
	public ResponseEntity<List<Map<String, Object>>> getProductNumByCategory() throws Exception {

		List<Map<String, Object>> result = productServ.getProductNumByCategory();
		return ResponseEntity.ok(result);
	}

	// 관리자
	// 상품 전체 목록 조회
	@GetMapping("/getProductsByAdmin")
	public ResponseEntity<List<ProductDTO>> getProductsByAdmin() throws Exception {
		List<ProductDTO> products = productServ.getProductsByAdmin();
		return ResponseEntity.ok(products);
	}

	// 관리자
	// 조건별 베스트 상품 조회
	@GetMapping("/getBestProduct/{condition}")
	public ResponseEntity<List<ProductDTO>> getBestProductByCondition(@PathVariable String condition) throws Exception {
		List<ProductDTO> result = productServ.getBestProductByCondition(condition);
		return ResponseEntity.ok(result);
	}

	// 관리자
	// 상품 추가 (관리자)
	@PostMapping
	@Transactional
	public ResponseEntity<String> addProduct(MultipartFile[] images, ProductDTO dto, int thumbNailIndex)
			throws Exception {

		// 대표 사진 파일 이름
		String thumbNailFileName = images[thumbNailIndex].getOriginalFilename();
		try {
			// 상품 정보 저장 후 대표 이미지 파일 GCP에 저장
			int result = productServ.addProduct(dto);
			if (result < 0) {
				throw new RuntimeException("상품 등록 실패");
			}
			int product_seq = dto.getProduct_seq();
			String url = fileServ.upload(images[thumbNailIndex], product_seq, "F3");

			// 상품 대표 이미지 url 업데이트
			int result2 = productServ.updateThumbNail(product_seq, url);
			if (result2 < 0) {
				throw new RuntimeException("대표 이미지 업데이트 실패");
			}

			for (MultipartFile img : images) {
				if (!img.getOriginalFilename().equals(thumbNailFileName)) {
					fileServ.upload(img, product_seq, "F3");
				}
			}
		} catch (Exception e) {
			// 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
			throw new RuntimeException("상품 등록 실패", e);
		}
		return ResponseEntity.ok().build();
	}

	// 상품 삭제 (관리자)
	@DeleteMapping
	@Transactional
	public ResponseEntity<String> deleteBanner(@RequestParam String seqs) throws Exception {
		String[] productSeqs = seqs.split(","); // seqs를 배열로 변환
		for (String productSeq : productSeqs) {
			try {
				int product_seq = Integer.parseInt(productSeq);
				if (!productServ.deleteProduct(product_seq)) {
					throw new RuntimeException("상품 삭제 실패: ");
				}
				List<String> sysNames = fileServ.getSysNames(product_seq, "F3");
				// 해당 상품에 포함된 파일 전부 삭제
				for (String sysName : sysNames) {
					String result = fileServ.deleteFile(sysName, "F3");
					if (result.equals("fail")) {
						throw new RuntimeException("파일 삭제 실패: " + sysName);
					}
				}
			} catch (Exception e) {
				// 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
				throw new RuntimeException("상품 삭제 실패", e);
			}
		}
		return ResponseEntity.ok("success");
	}

	// 상품 수량 변경 (관리자)
	@PutMapping
	@Transactional
	public ResponseEntity<String> updateBuQuantity(@RequestParam String seqs, @RequestParam int quantity)
			throws Exception {
		String[] productSeqs = seqs.split(","); // seqs를 배열로 변환
		for (String productSeq : productSeqs) {
			try {
				int product_seq = Integer.parseInt(productSeq);
				if (!productServ.updateByQuantity(product_seq, quantity)) {
					throw new RuntimeException("상품 수량 업데이트 실패: ");
				}
			} catch (Exception e) {
				// 예외 발생 시 롤백이 자동으로 이루어지도록 하기 위해 런타임 예외를 생성.
				throw new RuntimeException("상품 수량 업데이트 실패", e);
			}
		}
		return ResponseEntity.ok("success");
	}

	// 리뷰 신고목록 조회 (관리자)
	@GetMapping("/reportedReviews")
	public ResponseEntity<Map<String, Object>> getReportedReviews(@RequestParam int startRow, @RequestParam int endRow)
			throws Exception {

		// 전체 신고 리뷰 카운트
		int totalCount = reviewServ.getReportedReviewsCount();

		// 페이징된 리뷰 신고 목록 조회
		List<Map<String, Object>> reportedReviews = reviewServ.getReportedReviews(startRow, endRow);

		// 응답 데이터 구성
		Map<String, Object> response = new HashMap<>();
		response.put("totalCount", totalCount);
		response.put("reviews", reportedReviews);

		return ResponseEntity.ok(response);
	}

	// 리뷰 신고내역 조회 (관리자)
	@GetMapping("/reviewReport/{review_seq}")
	public ResponseEntity<List<ReviewReportDTO>> getReviewReport(@PathVariable int review_seq) throws Exception {
		List<ReviewReportDTO> reviewReports = reviewServ.getReviewReport(review_seq);
		System.out.println("컨트롤러 : " + reviewReports);
		return ResponseEntity.ok(reviewReports);
	}

	// 신고 리뷰 삭제 (관리자)
	@DeleteMapping("/deleteReview/{review_seq}")
	public ResponseEntity<Integer> deleteReview(@PathVariable int review_seq) throws Exception {
		int result = reviewServ.deleteReview(review_seq);

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