package com.example.datn.controller;

import com.example.datn.dto.request.ThongTinHoaDonRequest;
import com.example.datn.model.TraPhong;
import com.example.datn.service.ThongTinHoaDonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/thong-tin-hoa-don")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ThongTinHoaDonController {
    ThongTinHoaDonService thongTinHoaDonService;

    @GetMapping
    public ResponseEntity<?> getAllThongTinHoaDon(Pageable pageable) {
        return ResponseEntity.ok(thongTinHoaDonService.getAllThongTinHoaDon(pageable));
    }

    @GetMapping("/{idHoaDon}")
    public ResponseEntity<?> findThongTinHoaDonByHoaDonId(@PathVariable("idHoaDon") Integer idHoaDon){
        return ResponseEntity.status(HttpStatus.OK).body(thongTinHoaDonService.getThongTinHoaDonByHoaDonId(idHoaDon));
    }

    @PostMapping
    public ResponseEntity<?> createThongTinHoaDon(@RequestBody ThongTinHoaDonRequest tthdRequest) {
        System.out.println(tthdRequest.getIdHoaDon());
        System.out.println(tthdRequest.getListTraPhong());
        return ResponseEntity.status(HttpStatus.CREATED).body(thongTinHoaDonService.createThongTinHoaDon(tthdRequest.getIdHoaDon(),tthdRequest.getListTraPhong()));
    }
}
