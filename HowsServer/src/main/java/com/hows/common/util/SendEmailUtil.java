package com.hows.common.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class SendEmailUtil {

	@Autowired
    private JavaMailSender mailSender;
	@Value("${spring.mail.username}")
	private String sender;
	
	
	public void sendTempPw(String toEmail, String tempPw) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(sender);

        message.setSubject("임시 비밀번호 발급");
        message.setText("당신의 임시 비밀번호는 " + tempPw + " 입니다.");
        mailSender.send(message);
    }
}
