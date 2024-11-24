package com.example.datn.controller;

import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class HotelWebsiteController {
    @Autowired
    LoaiPhongServiceIMPL phongServiceIMPL;
    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

    @GetMapping("/index")
    public ResponseEntity<?> DanhSachTienNghi(Pageable pageable){
        Page<LoaiPhongResponse> ti = phongServiceIMPL.getPage(pageable);
        return ResponseEntity.ok(ti);
    }

    @GetMapping("loai-phong-kha-dung")
    public ResponseEntity<?> loaiPhongKhaDung(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong,
            @RequestParam(required = false) Integer idLoaiPhong
            ) {

        LocalDateTime ngayNhanPhongStart = (ngayNhanPhong != null) ? ngayNhanPhong.atStartOfDay() : LocalDate.now().atStartOfDay();
        LocalDateTime ngayTraPhongEnd = (ngayTraPhong != null) ? ngayTraPhong.atTime(23, 59, 59) : LocalDate.now().atTime(23, 59, 59);

        LoaiPhongKhaDungResponse p = loaiPhongServiceIMPL.LoaiPhongKhaDungByLoaiPhong(
                ngayNhanPhongStart, ngayTraPhongEnd, idLoaiPhong
        );

        return ResponseEntity.ok(p);
    }

}
