package com.hows.common.util;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

@Component
public class JwtUtil {

		// 토큰이 만료되기까지 걸리는 시간 값
		private long expiration = 86400; // 24시간의 초값  

		private Algorithm algo;
		private JWTVerifier verifier;

		public JwtUtil(@Value("${jwt.secret}") String secret) {
			this.algo = Algorithm.HMAC256(secret); // application.properties로 이동
			this.verifier = JWT.require(algo).build();
		}

		// 사용자가 로그인 성공하면 createToken 호출하여 사용자 ID기반으로 JWT 생성하고 클라이언트에게 반환
		public String createToken(String id, int seq, String nickname, String memberAvatar) {
			return JWT.create()
				.withSubject(id)
				.withClaim("member_seq", seq)
				.withClaim("nickname", nickname)
				.withClaim("member_avatar", memberAvatar)
				.withIssuedAt(new Date()) // issue : 발급되다 => 현재 시간으로 발급
				.withExpiresAt(new Date(System.currentTimeMillis() + (expiration * 1000))) // 24시간 
				.sign(this.algo); // 최종적으로 알고리즘(HMAC256)을 사용하여 토큰에 서명
		}
		
		public boolean isVerified(String token) {
			try {
				this.verifier.verify(token);
				return true;
			} catch(Exception e) {
				// 예외에 대한 로그 출력
		        System.out.println("토큰 검증 실패: " + e.getMessage());
				return false;
			}
		}
		
		public DecodedJWT verify(String token) {
			return this.verifier.verify(token); // verifier: token을 검증하기 위한 객체
			// 토큰의 유효성을 확인한 후, 유효하다면 DecodedJWT 객체를 반환
		}
		
		public String getSubject(String token) {
			return this.verifier.verify(token).getSubject(); 
			// 주어진 JWT 토큰 검증 후, 해당 토큰에 포함된 주체 정보(getSubject로 설정한 사용자 ID)를 추출하여 반환
		}
}
