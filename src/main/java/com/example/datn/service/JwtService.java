package com.example.datn.service;

import com.example.datn.common.TokenType;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public interface JwtService {
    String generateAccessToken(Integer userId, String username, Collection<? extends GrantedAuthority> authorities);

    String generateRefreshToken(Integer userId, String username, Collection<? extends GrantedAuthority> authorities);

    String extractUsername(String token , TokenType type);
}
