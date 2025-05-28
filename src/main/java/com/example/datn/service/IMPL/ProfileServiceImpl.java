package com.example.datn.service.IMPL;

import com.example.datn.common.TokenType;
import com.example.datn.controller.requests.ProfileRequest;
import com.example.datn.controller.response.ProfileResponse;
import com.example.datn.exception.AuthenticationCustomException;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.model.KhachHang;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.service.JwtService;
import com.example.datn.service.ProfileService;
import com.example.datn.utilities.CloudinaryUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "PROFILE-SERVICE")
public class ProfileServiceImpl implements ProfileService {
    private final JwtService jwtService;
    private final KhachHangRepository khachHangRepository;
    private final CloudinaryUtils cloudinaryUtils;

    @Override
    public ProfileResponse getProfile(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");
        log.info("accessToken : {}", accessToken.substring("Bearer ".length()));
        if (StringUtils.isBlank(accessToken)) {
            throw new AuthenticationCustomException("Token must be not blank!");
        }

        String username = this.jwtService.extractUsername(accessToken.substring("Bearer ".length()),
                TokenType.ACCESS_TOKEN);
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
                .avatar(khachHang.getAvatar())
                .build();
    }

    @Override
    public void updateProfileFullName(ProfileRequest.FullName request) {
        KhachHang kh = this.getKhachHangById(request.getId());
        kh.setHo(request.getLastName());
        kh.setTen(request.getFirstName());
        this.khachHangRepository.save(kh);
    }

    @Override
    public void updateProfileEmail(ProfileRequest.Email request) {
        KhachHang kh = this.getKhachHangById(request.getId());
        kh.setEmail(request.getEmail());
        this.khachHangRepository.save(kh);
    }

    @Override
    public void updateProfilePhoneNumber(ProfileRequest.PhoneNumber request) {
        KhachHang kh = this.getKhachHangById(request.getId());
        kh.setSdt(request.getPhoneNumber());
        this.khachHangRepository.save(kh);
    }

    @Override
    public void updateProfileGender(ProfileRequest.Gender request) {
        KhachHang kh = this.getKhachHangById(request.getId());
        kh.setGioiTinh(request.getGender());
        this.khachHangRepository.save(kh);
    }

    @Override
    public void updateProfileAddress(ProfileRequest.Address request) {
        KhachHang kh = this.getKhachHangById(request.getId());
        kh.setDiaChi(request.getAddress());
        this.khachHangRepository.save(kh);
    }

    @Override
    public void updateProfileAvatar(MultipartFile avatar, Integer id) {
        log.info("Update avatar file: {}", avatar.getOriginalFilename());
        KhachHang kh = this.getKhachHangById(id);
        Map<String, String> upload = this.cloudinaryUtils.upload(avatar);
        if (upload == null) {
            throw new EntityNotFountException("Upload avatar failed");
        }
        if(kh.getPublic_id() != null){
            this.cloudinaryUtils.removeByPublicId(kh.getPublic_id());
        }
        kh.setAvatar(upload.get("url"));
        kh.setPublic_id(upload.get("public_id"));
        this.khachHangRepository.save(kh);
    }

    private KhachHang getKhachHangByUsername(String username) {
        return this.khachHangRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFountException("KhachHang not found"));
    }

    private KhachHang getKhachHangById(Integer id) {
        return this.khachHangRepository.findById(id)
                .orElseThrow(() -> new EntityNotFountException("KhachHang not found"));
    }
}
