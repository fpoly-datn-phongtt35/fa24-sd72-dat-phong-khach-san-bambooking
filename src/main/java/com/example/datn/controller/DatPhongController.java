package com.example.datn.controller;


import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.service.IMPL.DatPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/dat-phong")
public class DatPhongController {
    @Autowired
    DatPhongServiceIMPL datPhongServiceIMPL;

    @GetMapping("hien-thi")
    public ResponseEntity<?> HienThiDatPhong(
            @RequestParam() String trangThai,
            Pageable pageable
    ) {
        Page<DatPhongResponse> dp = datPhongServiceIMPL.getByTrangThai(trangThai, pageable);
        System.out.println(trangThai);
        return ResponseEntity.ok(dp);
    }

    @GetMapping()
    public List<DatPhong> test(){
        return datPhongServiceIMPL.getAll();
    }


    @PostMapping("them-moi")
    public ResponseEntity<?> createDatPhong(@RequestBody DatPhongRequest datPhongRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(datPhongServiceIMPL.addDatPhong(datPhongRequest));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detailDatPhong(@PathVariable Integer id) {
        System.out.println(id);
        return ResponseEntity.status(HttpStatus.OK).body(datPhongServiceIMPL.detailDatPhong(id));
    }

    @PutMapping("cap-nhat/{id}")
    public ResponseEntity<?> updateDatPhong(@PathVariable Integer id, @RequestBody DatPhongRequest datPhongRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(datPhongServiceIMPL.updateDatPhong(id, datPhongRequest));
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

}
