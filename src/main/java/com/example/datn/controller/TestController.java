package com.example.datn.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/test-domain")
    public String testEndpoint() {
        return "Backend is running successfully!";
    }
}
