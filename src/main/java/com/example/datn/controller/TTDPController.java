package com.example.datn.controller;

import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.TTDPResponse;
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
import java.util.List;

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

    @GetMapping("/hien-thi-quan-ly")
    public ResponseEntity<?> hienThiQuanLy(@RequestParam("trangThai") String trangThai, Pageable pageable) {
        return ResponseEntity.ok(thongTinDatPhongServiceIMPL.HienThiQuanLy(trangThai, pageable));
    }
    @GetMapping("hien-thi-by-iddp")
    public List<ThongTinDatPhong> getByIDDP(@RequestParam(value = "idDP") Integer idDP){
        return thongTinDatPhongServiceIMPL.getByIDDP(idDP);
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
                                          @RequestParam(required = false) Integer soNguoi,
                                          Pageable pageable){
        LocalDateTime ngayNhanPhongStart = ngayNhanPhong.atStartOfDay();
        LocalDateTime ngayTraPhongEnd = ngayTraPhong.atTime(23, 59, 59);
        Page<LoaiPhongKhaDungResponse> p = loaiPhongServiceIMPL.LoaiPhongKhaDung(ngayNhanPhongStart,ngayTraPhongEnd,soNguoi,pageable);
        return ResponseEntity.ok(p);
    }

    @GetMapping("chi-tiet-dat-phong")
    public ResponseEntity<?> chiTietDatPhong(@RequestParam String maDatPhong){
        List<ThongTinDatPhong> ttdps = thongTinDatPhongServiceIMPL.findByMaDatPhong(maDatPhong);
        return ResponseEntity.ok(ttdps);
    }

    @GetMapping("/tim-kiem")
    public Page<TTDPResponse> timKiemThongTinDatPhong(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String key,
            @RequestParam(required = false) String trangThai,
            Pageable pageable) {
        return thongTinDatPhongServiceIMPL.findByDateRangeAndKey(startDate, endDate, key, trangThai, pageable);
    }

}
