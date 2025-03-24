package com.example.datn.controller;

import com.example.datn.dto.request.TraPhongRequest;
import com.example.datn.dto.response.TraPhongResponse;
import com.example.datn.model.TraPhong;
import com.example.datn.service.TraPhongService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
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

    @GetMapping("check-out")
    public ResponseEntity<List<TraPhongResponse>> searchListRoomByKey(@RequestParam("key") String key) {
        return ResponseEntity.ok(traPhongService.checkOutByKey(key));
    }

    @GetMapping("check-out-by-id")
    public ResponseEntity<TraPhong> checkOutById(@RequestParam("idTraPhong") Integer idTraPhong) {
        return ResponseEntity.status(HttpStatus.OK).body(traPhongService.checkOutById(idTraPhong));
    }

    @GetMapping("thong-tin-tra-phong")
    public ResponseEntity<?> DSTraPhong() {
        return ResponseEntity.ok(traPhongService.DSTraPhong());
    }
}
