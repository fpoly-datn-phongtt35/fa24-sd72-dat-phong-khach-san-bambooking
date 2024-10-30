package com.example.datn.controller;

import com.example.datn.dto.request.TraPhongRequest;
import com.example.datn.service.TraPhongService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/tra-phong")
public class TraPhongController {
    private final TraPhongService traPhongService;

    @GetMapping
    public ResponseEntity<?> getAllTraPhong(Pageable pageable) {
        return ResponseEntity.ok(traPhongService.getAllTraPhong(pageable));
    }

    @PostMapping
    public ResponseEntity<?> createTraPhong(@RequestBody TraPhongRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(traPhongService.createTraPhong(request));
    }
}
