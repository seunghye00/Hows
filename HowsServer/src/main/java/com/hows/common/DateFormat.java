package com.hows.common;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
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

	// 문자열을 Date로 변환하는 메서드
	public static Date convertToDate(String dateString) throws Exception {
		
		// 문자열을 java.util.Date로 파싱
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date utilDate = sdf.parse(dateString);

		// java.util.Date를 java.sql.Date로 변환
		Date sqlDate = new Date(utilDate.getTime());
		return sqlDate;
	}
}
