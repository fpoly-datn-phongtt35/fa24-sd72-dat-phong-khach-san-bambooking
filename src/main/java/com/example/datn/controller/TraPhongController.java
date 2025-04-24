package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.model.TraPhong;
import com.example.datn.service.TraPhongService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j(topic = "TRA_PHONG_CONTROLLER")
@RestController
@RequiredArgsConstructor
@RequestMapping("/tra-phong")
public class TraPhongController {
    private final TraPhongService traPhongService;

    @GetMapping
    public ResponseEntity<?> getAllTraPhong(Pageable pageable) {
        log.info("Get all tra phong");
        return ResponseEntity.ok(traPhongService.getAllTraPhong(pageable));
    }

    @GetMapping("check-out")
    public ResponseEntity<List<TraPhongResponse>> searchListRoomByKey(@RequestParam("key") String key) {
        log.info("Search tra phong with key {}", key);
        return ResponseEntity.ok(traPhongService.checkOutByKey(key));
    }

    @GetMapping("check-out-by-id")
    public ResponseEntity<TraPhong> checkOutById(@RequestParam("idTraPhong") Integer idTraPhong) {
        log.info("Check out tra phong with id {}", idTraPhong);
        return ResponseEntity.status(HttpStatus.OK).body(traPhongService.checkOutById(idTraPhong));
    }

    @GetMapping("thong-tin-tra-phong")
    public ResponseEntity<?> DSTraPhong() {
        return ResponseEntity.ok(traPhongService.DSTraPhong());
    }
}
