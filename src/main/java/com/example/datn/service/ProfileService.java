package com.example.datn.service;

import com.example.datn.controller.requests.ProfileRequest;
import com.example.datn.controller.response.ProfileResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
    ProfileResponse getProfile(HttpServletRequest request);

    void updateProfileFullName(ProfileRequest.FullName request);

    void updateProfileEmail(ProfileRequest.Email request);

    void updateProfilePhoneNumber(ProfileRequest.PhoneNumber request);

    void updateProfileGender(ProfileRequest.Gender request);

    void updateProfileAddress(ProfileRequest.Address request);

    void updateProfileAvatar(MultipartFile avatar, Integer id);
}
