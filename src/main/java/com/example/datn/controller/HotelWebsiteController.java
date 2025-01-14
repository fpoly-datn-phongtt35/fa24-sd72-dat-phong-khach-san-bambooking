package com.example.datn.controller;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.model.LoaiPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.HotelWebsiteService;
import com.example.datn.service.IMPL.DatPhongServiceIMPL;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
import com.example.datn.service.LoaiPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class HotelWebsiteController {
    @Autowired
    LoaiPhongService loaiPhongService;
    @Autowired
    DatPhongServiceIMPL datPhongServiceIMPL;
    @Autowired
    ThongTinDatPhongServiceIMPL thongTinDatPhongServiceIMPL;
    @Autowired
    HotelWebsiteService hotelWebsiteService;

    @GetMapping("/index")
<<<<<<< HEAD
    public ResponseEntity<?> DanhSachTienNghi(Pageable pageable) {
        Page<LoaiPhongResponse> ti = phongServiceIMPL.getPage(pageable);
=======
    public ResponseEntity<?> DanhSachTienNghi(Pageable pageable){
        Page<LoaiPhongResponse> ti = loaiPhongService.getPage(pageable);
>>>>>>> tuan_dat
        return ResponseEntity.ok(ti);
    }

    @GetMapping("loai-phong-kha-dung")
    public ResponseEntity<?> loaiPhongKhaDung(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong,
            @RequestParam(required = false) Integer idLoaiPhong) {

        LocalDateTime ngayNhanPhongStart = (ngayNhanPhong != null) ? ngayNhanPhong.atStartOfDay()
                : LocalDate.now().atStartOfDay();
        LocalDateTime ngayTraPhongEnd = (ngayTraPhong != null) ? ngayTraPhong.atTime(23, 59, 59)
                : LocalDate.now().atTime(23, 59, 59);

<<<<<<< HEAD
        LoaiPhongKhaDungResponse p = loaiPhongServiceIMPL.LoaiPhongKhaDungByLoaiPhong(
                ngayNhanPhongStart, ngayTraPhongEnd, idLoaiPhong);
=======
        LoaiPhongKhaDungResponse p = loaiPhongService.LoaiPhongKhaDungByLoaiPhong(
                ngayNhanPhongStart, ngayTraPhongEnd, idLoaiPhong
        );
>>>>>>> tuan_dat

        return ResponseEntity.ok(p);
    }

    @PostMapping("/create-kh-dp")
    public ResponseEntity<?> createKhachHangDatPhong(@RequestBody KhachHangDatPhongRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelWebsiteService.createKhachHangDatPhong(request));
    }

    @PostMapping("them-moi-dp")
    public ResponseEntity<DatPhongResponse> createDatPhong(@RequestBody DatPhongRequest datPhongRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelWebsiteService.addDatPhong(datPhongRequest));
    }

    @PostMapping("them-moi")
    public ResponseEntity<ThongTinDatPhong> createDatPhong(@RequestBody TTDPRequest request) {
        ThongTinDatPhong ttdp = hotelWebsiteService.add(request);
        if (ttdp != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ttdp);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
