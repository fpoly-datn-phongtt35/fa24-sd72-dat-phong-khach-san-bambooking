package com.example.datn.service.IMPL;

import com.example.datn.common.TokenType;
import com.example.datn.controller.response.ProfileResponse;
import com.example.datn.exception.AuthenticationCustomException;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.model.KhachHang;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.service.JwtService;
import com.example.datn.service.ProfileService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "PROFILE-SERVICE")
public class ProfileServiceImpl implements ProfileService {
    private final JwtService jwtService;
    private final KhachHangRepository khachHangRepository;

    @Override
    public ProfileResponse getProfile(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");
        log.info("accessToken : {}", accessToken.substring("Bearer ".length()));
        if (StringUtils.isBlank(accessToken)) {
            throw new AuthenticationCustomException("Token must be not blank!");
        }

        String username = this.jwtService.extractUsername(accessToken.substring("Bearer ".length()), TokenType.ACCESS_TOKEN);
        log.info("Get Profile by username: {}", username);
        var khachHang = this.getKhachHangByUsername(username);
        return ProfileResponse.builder()
                .id(khachHang.getId())
                .gender(khachHang.getGioiTinh())
                .lastName(khachHang.getHo())
                .firstName(khachHang.getTen())
                .email(khachHang.getEmail())
                .phoneNumber(khachHang.getSdt())
                .address(khachHang.getDiaChi())
                .build();
    }

    private KhachHang getKhachHangByUsername(String username) {
        return this.khachHangRepository.findByUsername(username).orElseThrow(() -> new EntityNotFountException("KhachHang not found"));
    }
}
