package com.example.datn.controller;


import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.service.IMPL.DatPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/dat-phong")
public class DatPhongController {
    @Autowired
    DatPhongServiceIMPL phongServiceIMPL;

    @GetMapping("hien-thi")
    public ResponseEntity<?> getAllSanPham(
            @RequestParam() String trangThai,
            Pageable pageable
    ) {
        Page<DatPhongResponse> dp = phongServiceIMPL.getByTrangThai(trangThai, pageable);
        System.out.println(trangThai);
        return ResponseEntity.ok(dp);
    }

    @GetMapping()
    public List<DatPhong> test(){
        return phongServiceIMPL.getAll();
    }

}
