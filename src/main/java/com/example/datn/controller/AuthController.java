package com.example.datn.controller;

import com.example.datn.dto.request.auth.SigninRequest;
import com.example.datn.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Value("${cloudinary.api_key}")
    private String cloudName;
    private final AuthService authService;

    @PostMapping("/access")
    public ResponseEntity<?> accessToken(@Valid @RequestBody SigninRequest req) {
        System.out.printf("Cloud Name: %s%n", cloudName);
        return ResponseEntity.ok(this.authService.authenticate(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        return ResponseEntity.ok(this.authService.refresh(request));
    }
}
