package com.example.datn.controller;


import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.ToHopRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.dto.response.datphong.ToHopPhongPhuHop;
import com.example.datn.model.DatPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.IMPL.DatPhongServiceIMPL;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import com.example.datn.service.IMPL.PhongServiceIMPL;
import jakarta.persistence.EntityNotFoundException;
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
import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/dat-phong")
@CrossOrigin("*")
public class DatPhongController {
    @Autowired
    DatPhongServiceIMPL datPhongServiceIMPL;

    @Autowired
    PhongServiceIMPL phongServiceIMPL;

    @Autowired
    LoaiPhongServiceIMPL loaiPhongServiceIMPL;

    @GetMapping("hien-thi")
    public ResponseEntity<?> HienThiDatPhong(@RequestParam() String trangThai, Pageable pageable) {
        Page<DatPhongResponse> dp = datPhongServiceIMPL.getByTrangThai(trangThai, pageable);
        System.out.println(trangThai);
        return ResponseEntity.ok(dp);
    }

    @GetMapping()
    public List<DatPhong> test() {
        return datPhongServiceIMPL.getAll();
    }


    @PostMapping("them-moi")
    public ResponseEntity<DatPhongResponse> createDatPhong(@RequestBody DatPhongRequest datPhongRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(datPhongServiceIMPL.addDatPhong(datPhongRequest));
    }


    @GetMapping("/chi-tiet")
    public ResponseEntity<?> detailDatPhong(@RequestParam(value = "idDatPhong") Integer idDP) {
        System.out.println(idDP);
        return ResponseEntity.status(HttpStatus.OK).body(datPhongServiceIMPL.detailDatPhong(idDP));
    }

    @PutMapping("cap-nhat")
    public ResponseEntity<?> updateDatPhong(@RequestBody DatPhongRequest datPhongRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(datPhongServiceIMPL.updateDatPhong(datPhongRequest));
    }

//    @GetMapping("bo-loc")
//    public ResponseEntity<?> HienThiTheoLoc(
//            @RequestParam() List<String> trangThai,
//            Pageable pageable) {
//        Page<DatPhongResponse> dp = datPhongServiceIMPL.LocTheoTrangThai(trangThai, pageable);
//        return ResponseEntity.ok(dp);
//    }

    @GetMapping("tim-kiem")
    public ResponseEntity<?> HienThiTimKiem(
            @RequestParam() String keyword, @RequestParam() LocalDateTime start, @RequestParam() LocalDateTime end,
            Pageable pageable) {
        Page<DatPhongResponse> dp = datPhongServiceIMPL.searchDatPhong(keyword, start, end, pageable);
        return ResponseEntity.ok(dp);
    }

    @GetMapping("chi-tiet-dat-phong")
    public ResponseEntity<?> ChiTietDatPhong(@RequestParam String maDatPhong) {
        return ResponseEntity.ok(datPhongServiceIMPL.findByMaDatPhong(maDatPhong));
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAllDatPhong(
            @RequestParam(value = "keyword", required = false) String keyword,
            Pageable pageable) {
        Page<DatPhongResponse> responses = datPhongServiceIMPL.findAll(keyword, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(responses);
    }

    @PostMapping("them-gio-hang")
    public ResponseEntity<Integer> addDatPhongNgay(@RequestBody DatPhongRequest datPhongRequest) {
        DatPhong datPhong = datPhongServiceIMPL.addDatPhongNgay(datPhongRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(datPhong.getId());
    }


    @GetMapping("danh-sach")
    public ResponseEntity<?> DSDatPhong(Pageable pageable) {
        return ResponseEntity.ok(datPhongServiceIMPL.DSDatPhong(pageable));
    }

    @DeleteMapping("xoa")
    public ResponseEntity<?> xoaDatPhong(@RequestParam Integer iddp) {
        try {
            datPhongServiceIMPL.xoaDatPhong(iddp);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Đặt phòng không tồn tại.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi trong quá trình xóa đặt phòng.");
        }
    }

    @GetMapping("dat-phong-to-checkin")
    public ResponseEntity<?> findDatPhongToCheckin(
            @RequestParam(value = "key", defaultValue = "", required = false) String key,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "ngayNhanPhong", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
            @RequestParam(value = "ngayTraPhong", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong) {
        Page<DatPhongResponse> responses = datPhongServiceIMPL.findDatPhongToCheckin(key, page, size,ngayNhanPhong,ngayTraPhong);
        return ResponseEntity.status(HttpStatus.OK).body(responses);
    }

    @GetMapping("danh-sach-dat-phong")
    public ResponseEntity<Page<DatPhongResponse>> findDatPhong(
            @RequestParam(value = "key", defaultValue = "", required = false) String key,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "ngayNhanPhong", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhanPhong,
            @RequestParam(value = "ngayTraPhong", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTraPhong) {
        Page<DatPhongResponse> result = datPhongServiceIMPL.findDatPhong(
                key, ngayNhanPhong, ngayTraPhong, page, size);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/to-hop-loai-phong-kha-dung")
    public ResponseEntity<Page<ToHopPhongPhuHop>> toHopLoaiPhongKhaDung(
            @RequestBody ToHopRequest request,
            @PageableDefault(size = 5) Pageable pageable) {
        LocalDateTime ngayNhanPhongLocal = request.getNgayNhanPhong() != null
                ? ZonedDateTime.parse(request.getNgayNhanPhong()).toLocalDateTime()
                : null;
        LocalDateTime ngayTraPhongLocal = request.getNgayTraPhong() != null
                ? ZonedDateTime.parse(request.getNgayTraPhong()).toLocalDateTime()
                : null;
        Page<ToHopPhongPhuHop> p = loaiPhongServiceIMPL.getToHopPhongPhuHop(
                ngayNhanPhongLocal,
                ngayTraPhongLocal,
                request.getSoNguoi(),
                request.getKey(),
                request.getTongChiPhiMin(),
                request.getTongChiPhiMax(),
                request.getTongSoPhongMin(),
                request.getTongSoPhongMax(),
                request.getTongSucChuaMin(),
                request.getTongSucChuaMax(),
                request.getLoaiPhongChons(),
                pageable
        );
        return ResponseEntity.ok(p);
    }

    @GetMapping("/huy-dp")
    public DatPhong huyDP(@RequestParam String maDatPhong) {
        return datPhongServiceIMPL.huyDatPhong(maDatPhong);
    }


}
