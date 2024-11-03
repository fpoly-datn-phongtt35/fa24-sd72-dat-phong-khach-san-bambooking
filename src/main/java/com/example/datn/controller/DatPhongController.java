package com.example.datn.controller;


import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.service.IMPL.DatPhongServiceIMPL;
import com.example.datn.service.IMPL.PhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/dat-phong")
public class DatPhongController {
    @Autowired
    DatPhongServiceIMPL datPhongServiceIMPL;

    @Autowired
    PhongServiceIMPL phongServiceIMPL;

    @GetMapping("hien-thi")
    public ResponseEntity<?> HienThiDatPhong(@RequestParam() String trangThai,Pageable pageable) {
        Page<DatPhongResponse> dp = datPhongServiceIMPL.getByTrangThai(trangThai, pageable);
        System.out.println(trangThai);
        return ResponseEntity.ok(dp);
    }

    @GetMapping()
    public List<DatPhong> test(){
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

    @GetMapping("bo-loc")
    public ResponseEntity<?> HienThiTheoLoc(
            @RequestParam() List<String> trangThai,
            Pageable pageable){
        Page<DatPhongResponse> dp = datPhongServiceIMPL.LocTheoTrangThai(trangThai,pageable);
        return ResponseEntity.ok(dp);
    }

    @GetMapping("tim-kiem")
    public ResponseEntity<?> HienThiTimKiem(
            @RequestParam() String keyword, @RequestParam() LocalDateTime start, @RequestParam() LocalDateTime end,
            Pageable pageable){
        Page<DatPhongResponse> dp = datPhongServiceIMPL.searchDatPhong(keyword,start,end,pageable);
        return ResponseEntity.ok(dp);
    }

    @GetMapping("chi-tiet-dat-phong")
    public ResponseEntity<?> ChiTietDatPhong(@RequestParam String maDatPhong){
        return ResponseEntity.ok(datPhongServiceIMPL.findByMaDatPhong(maDatPhong));
    }
}
