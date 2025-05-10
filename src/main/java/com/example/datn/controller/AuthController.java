package com.example.datn.controller;

import com.example.datn.dto.request.auth.SigninRequest;
import com.example.datn.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/access")
    public ResponseEntity<?> accessToken(@Valid @RequestBody SigninRequest req) {
        return ResponseEntity.ok(this.authService.authenticate(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        return ResponseEntity.ok(this.authService.refresh(request));
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestParam String email) {
        return ResponseEntity.ok(this.authService.signUp(email));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest req) {
        return ResponseEntity.ok(this.authService.verifyCode(req));
    }

    @Getter
    public static class VerifyCodeRequest {
        private String code;

        private String encodedCode;

        private String email;
    }
}
