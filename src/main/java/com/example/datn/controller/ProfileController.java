package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/${api.version}/profile")
@RequiredArgsConstructor
@Slf4j(topic = "PROFILE-CONTROLLER")
@Validated
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ResponseData<?> getProfile(HttpServletRequest request) {
        log.info("GET/profile");
        return new ResponseData<>(200, "OK", this.profileService.getProfile(request));
    }
}
