package com.example.datn.service;

import com.example.datn.controller.response.ProfileResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface ProfileService {
    ProfileResponse getProfile(HttpServletRequest request);
}
