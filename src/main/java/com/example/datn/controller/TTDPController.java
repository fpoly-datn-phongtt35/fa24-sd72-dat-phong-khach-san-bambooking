package com.example.datn.controller;

import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.SearchResultResponse;
import com.example.datn.dto.response.TTDPResponse;
import com.example.datn.dto.response.datphong.ToHopPhongPhuHop;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
import com.example.datn.service.LoaiPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
    LoaiPhongService loaiPhongService;

    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

    @GetMapping("all")
    public Page<ThongTinDatPhong> all(Pageable pageable) {
        return thongTinDatPhongServiceIMPL.getAll(pageable);
    }

    @GetMapping("/hien-thi-quan-ly")
    public ResponseEntity<?> hienThiQuanLy(@RequestParam("trangThai") String trangThai, Pageable pageable) {
        return ResponseEntity.ok(thongTinDatPhongServiceIMPL.HienThiQuanLy(trangThai, pageable));
    }

    @GetMapping("hien-thi-by-iddp")
    public List<ThongTinDatPhong> getByIDDP(@RequestParam(value = "idDP") Integer idDP) {
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

    @PutMapping("sua")
    public ResponseEntity<ThongTinDatPhong> updateDatPhong(@RequestBody TTDPRequest request) {
        ThongTinDatPhong ttdp = thongTinDatPhongServiceIMPL.update(request);
        if (ttdp != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ttdp);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @GetMapping("loai-phong-kha-dung")
    public List<LoaiPhongResponse> loaiPhongKhaDung(@RequestParam(required = false) LocalDateTime ngayNhanPhong, @RequestParam(required = false) LocalDateTime ngayTraPhong) {
        List<LoaiPhongResponse> p = loaiPhongServiceIMPL.getAllLPR(ngayNhanPhong, ngayTraPhong);
        return p;
    }

    @GetMapping("/tim-kiem-loai-phong")
    public ResponseEntity<Page<SearchResultResponse>> searchLoaiPhong2(@RequestParam("ngayNhanPhong") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayNhanPhong, @RequestParam("ngayTraPhong") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayTraPhong, @RequestParam("soNguoi") Integer soNguoi, @RequestParam("soPhong") Integer soPhong, @PageableDefault(size = 5) Pageable pageable) {
        // Tìm các kết hợp phòng khả dụng
        Page<SearchResultResponse> availableCombinations = loaiPhongServiceIMPL.searchAvailableRooms(ngayNhanPhong, ngayTraPhong, soNguoi, soPhong, pageable);
        return ResponseEntity.ok(availableCombinations);
    }

    @GetMapping("chi-tiet-dat-phong")
    public ResponseEntity<?> chiTietDatPhong(@RequestParam String maDatPhong) {
        List<ThongTinDatPhong> ttdps = thongTinDatPhongServiceIMPL.findByMaDatPhong(maDatPhong);
        return ResponseEntity.ok(ttdps);
    }

    @GetMapping("/tim-kiem")
    public Page<TTDPResponse> timKiemThongTinDatPhong(@RequestParam(required = false) LocalDate startDate,
                                                      @RequestParam(required = false) LocalDate endDate,
                                                      @RequestParam(required = false) String key,
                                                      @RequestParam(required = false) String trangThai,
                                                      Pageable pageable) {
        return thongTinDatPhongServiceIMPL.findByDateRangeAndKey(startDate, endDate, key, trangThai, pageable);
    }

    @GetMapping("/huy-ttdp")
    public ThongTinDatPhong huyTTDP(@RequestParam String maThongTinDatPhong) {
        return thongTinDatPhongServiceIMPL.huyTTDP(maThongTinDatPhong);
    }

    @GetMapping("detail-ttdp")
    public ResponseEntity<?> chiTietTTDP(@RequestParam String maTTDP) {
        ThongTinDatPhong ttdp = thongTinDatPhongServiceIMPL.getByMaTTDP(maTTDP);
        return ResponseEntity.ok(ttdp);
    }

    @GetMapping("list-gio-hang")
    public List<ThongTinDatPhong> getGioHang(@RequestParam(value = "idDatPhong") Integer idDatPhong) {
        return thongTinDatPhongServiceIMPL.getGioHang(idDatPhong);
    }

    @GetMapping("/xoa-ttdp")
    public ResponseEntity<?> huyTTDP(@RequestParam Integer idTTDP) {
        thongTinDatPhongServiceIMPL.xoaTTDP(idTTDP);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("update")
    public ResponseEntity<ThongTinDatPhong> updateTTDP(@RequestBody TTDPRequest request) {
        ThongTinDatPhong ttdp = thongTinDatPhongServiceIMPL.update(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ttdp);
    }

    @GetMapping("to-hop-loai-phong-kha-dung")
    public Page<ToHopPhongPhuHop> toHopLoaiPhongKhaDung(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayNhanPhong,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime ngayTraPhong,
                                                        @RequestParam(required = false) Integer soNguoi,
                                                        @RequestParam(required = false) String key,
                                                        @RequestParam(required = false) Double tongChiPhiMin,
                                                        @RequestParam(required = false) Double tongChiPhiMax,
                                                        @RequestParam(required = false) Integer tongSoPhongMin,
                                                        @RequestParam(required = false) Integer tongSoPhongMax,
                                                        @RequestParam(required = false) Integer tongSucChuaMin,
                                                        @RequestParam(required = false) Integer tongSucChuaMax,
                                                        @RequestParam(required = false) String loaiPhong,
                                                        @RequestParam(required = false) Integer soLuongChonMin,
                                                        @PageableDefault(size = 5) Pageable pageable) {
        Page<ToHopPhongPhuHop> p = loaiPhongServiceIMPL.TESTDATPHONG(ngayNhanPhong, ngayTraPhong,soNguoi, key, tongChiPhiMin,
                tongChiPhiMax, tongSoPhongMin, tongSoPhongMax, tongSucChuaMin, tongSucChuaMax,loaiPhong, soLuongChonMin, pageable);
        return p;
    }
}
