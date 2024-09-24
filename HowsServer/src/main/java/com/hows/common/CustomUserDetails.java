package com.hows.common;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUserDetails extends User {
    private int memberSeq;
    private String nickname;
    private String memberAvatar;
    private String memberRoleCode;

    public CustomUserDetails(
    		String username, 
    		String password, 
    		Collection<? extends GrantedAuthority> authorities, 
    		int memberSeq, 
    		String nickname, 
    		String memberAvatar,
    		String memberRoleCode) {
        super(username, password, authorities);
        this.memberSeq = memberSeq;
        this.nickname = nickname;
        this.memberAvatar = memberAvatar;
        this.memberRoleCode = memberRoleCode;
    }

    public int getMemberSeq() {
        return memberSeq;
    }

	public String getNickname() {
		return nickname;
	}

	public String getMemberAvatar() {
		return memberAvatar;
	}

	public String getMemberRoleCode() {
		return memberRoleCode;
	}
    
}
