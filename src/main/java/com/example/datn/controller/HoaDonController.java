package com.example.datn.controller;

import com.example.datn.dto.request.HoaDonRequest;
import com.example.datn.dto.response.HoaDonResponse;
import com.example.datn.service.HoaDonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/hoa-don")
public class HoaDonController {
    HoaDonService hoaDonService;

    @GetMapping
    public ResponseEntity<?> getAllHoaDon(
            @RequestParam(value = "trangThai", required = false) String trangThai,
            @RequestParam(value = "keyword", required = false) String keyword,
            Pageable pageable) {
        Page<HoaDonResponse> hoaDonResponses = hoaDonService.getHoaDonByTrangThai(trangThai, keyword, pageable);
        return ResponseEntity.ok(hoaDonResponses);
    }

    @PostMapping("tao-hoa-don")
    public ResponseEntity<?> createHoaDon(@RequestBody HoaDonRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hoaDonService.createHoaDon(request));
    }

    @GetMapping("/{idHoaDon}")
    public ResponseEntity<?> getHoaDonById(@PathVariable("idHoaDon") Integer idHoaDon){
        return ResponseEntity.ok(hoaDonService.getOneHoaDon(idHoaDon));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatusInvoice(@PathVariable("id") Integer id) {
        try {
            String message = hoaDonService.changeStatusHoaDon(id);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
