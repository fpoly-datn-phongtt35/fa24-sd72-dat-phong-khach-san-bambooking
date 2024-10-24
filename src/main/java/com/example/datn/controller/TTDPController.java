package com.example.datn.controller;

import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@CrossOrigin("*")
@RestController
@RequestMapping("/ttdp")
public class TTDPController {
    @Autowired
    ThongTinDatPhongServiceIMPL thongTinDatPhongServiceIMPL;

    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

    @GetMapping("all")
    public Page<ThongTinDatPhong> all(Pageable pageable){
        return thongTinDatPhongServiceIMPL.getAll(pageable);
    }

    @GetMapping("hien-thi")
    public Page<ThongTinDatPhong> getByIDDP(@RequestParam(value = "idDP") Integer idDP,Pageable pageable){
        return thongTinDatPhongServiceIMPL.getByIDDP(idDP,pageable);
    }
    @PostMapping("them-moi")
    public ResponseEntity<ThongTinDatPhong> createDatPhong(@RequestBody TTDPRequest request) {
        ThongTinDatPhong ttdp = thongTinDatPhongServiceIMPL.add(request);
        if (ttdp != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ttdp);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("loai-phong-kha-dung")
    public ResponseEntity<?> PhongKhaDung(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
                                          @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong,
                                          Pageable pageable){
        LocalDateTime ngayNhanPhongStart = ngayNhanPhong.atStartOfDay();
        LocalDateTime ngayTraPhongEnd = ngayTraPhong.atTime(23, 59, 59);
        Page<LoaiPhongKhaDungResponse> p = loaiPhongServiceIMPL.LoaiPhongKhaDung(ngayNhanPhongStart,ngayTraPhongEnd,pageable);
        return ResponseEntity.ok(p);

    }
}
