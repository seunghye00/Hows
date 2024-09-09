package com.hows.common;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUserDetails extends User {
    private int memberSeq;

    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities, int memberSeq) {
        super(username, password, authorities);
        this.memberSeq = memberSeq;
    }

    public int getMemberSeq() {
        return memberSeq;
    }
}
