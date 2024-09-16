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

        message.setSubject("[Hows] 임시 비밀번호 발급 안내");
        message.setText(new StringBuilder()
                .append("안녕하세요,\n\n")
                .append("회원님의 요청에 따라 임시 비밀번호가 발급되었습니다.\n")
                .append("아래의 임시 비밀번호를 사용하여 로그인하신 후, 안전을 위해 반드시 비밀번호를 변경해주시기 바랍니다.\n\n")
                .append("임시 비밀번호:  ")
                .append(tempPw)
                .append("\n\n")
                .append("※ 본 이메일은 자동 발송된 메일로 회신이 불가합니다. 문의 사항이 있으시면 고객센터로 연락해주시기 바랍니다.\n\n")
                .append("감사합니다.\n")
                .append("Hows 고객 지원팀")
                .toString());
        
        mailSender.send(message);
    }
}
