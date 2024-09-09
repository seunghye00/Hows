package com.hows.common;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateFormat {
	
	// 문자열을 Timestamp로 변환하는 메서드
    public static Timestamp convertToTimestamp(String dateTimeString) {
        // 문자열을 LocalDateTime으로 변환
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime localDateTime = LocalDateTime.parse(dateTimeString, formatter);

        // LocalDateTime을 Timestamp로 변환
        return Timestamp.valueOf(localDateTime);
    }
}
