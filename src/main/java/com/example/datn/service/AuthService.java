package com.example.datn.service;

import com.example.datn.controller.AuthController;
import com.example.datn.dto.request.auth.SigninRequest;
import com.example.datn.dto.response.auth.TokenResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    TokenResponse authenticate(SigninRequest signinRequest);

    TokenResponse refresh(HttpServletRequest request);

    String signUp(String email);

    boolean verifyCode(AuthController.VerifyCodeRequest request);
}
