package com.example.datn.dto.response.auth;

import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;
import java.util.Collection;

@Getter
@Builder
public class TokenResponse implements Serializable {
    private String accessToken;
    private String refreshToken;
    private String username;
    private String avatar;
    private Collection<? extends GrantedAuthority> role;
}
