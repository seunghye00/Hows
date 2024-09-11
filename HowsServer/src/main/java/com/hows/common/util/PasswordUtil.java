package com.hows.common.util;

import java.util.UUID;

public class PasswordUtil {

	// [로그인] 비밀번호 찾기 - 8자리 임시 비밀번호 생성
	public static String generateTemporaryPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
