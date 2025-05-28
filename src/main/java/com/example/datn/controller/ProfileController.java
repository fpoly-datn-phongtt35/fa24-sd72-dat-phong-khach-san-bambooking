package com.example.datn.controller;

import com.example.datn.controller.requests.ProfileRequest;
import com.example.datn.controller.response.ResponseData;
import com.example.datn.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PutMapping("/full-name")
    public ResponseData<?> updateProfileFullName(@RequestBody ProfileRequest.FullName request) {
        log.info("PUT/profile/full-name");
        this.profileService.updateProfileFullName(request);
        return new ResponseData<>(200, "OK");
    }

    @PutMapping("/email")
    public ResponseData<?> updateProfileEmail(@RequestBody ProfileRequest.Email request) {
        log.info("PUT/profile/email");
        this.profileService.updateProfileEmail(request);
        return new ResponseData<>(200, "OK");
    }

    @PutMapping("/phone-number")
    public ResponseData<?> updateProfilePhoneNumber(@RequestBody ProfileRequest.PhoneNumber request) {
        log.info("PUT/profile/phone-number");
        this.profileService.updateProfilePhoneNumber(request);
        return new ResponseData<>(200, "OK");
    }

    @PutMapping("/gender")
    public ResponseData<?> updateProfileGender(@RequestBody ProfileRequest.Gender request) {
        log.info("PUT/profile/gender");
        this.profileService.updateProfileGender(request);
        return new ResponseData<>(200, "OK");
    }

    @PutMapping("/address")
    public ResponseData<?> updateProfileAddress(@RequestBody ProfileRequest.Address request) {
        log.info("PUT/profile/address");
        this.profileService.updateProfileAddress(request);
        return new ResponseData<>(200, "OK");
    }

    @PutMapping("/avatar")
    public ResponseData<?> updateProfileAvatar(@RequestParam("avatar") MultipartFile avatar, @RequestParam("id") Integer id) {
        log.info("PUT/profile/avatar");
        this.profileService.updateProfileAvatar(avatar, id);
        return new ResponseData<>(200, "OK");
    }
}
