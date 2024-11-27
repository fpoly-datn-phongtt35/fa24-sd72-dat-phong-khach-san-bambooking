package com.example.datn.controller;

import com.example.datn.dto.request.KhachHangCheckinRequest;
import com.example.datn.model.KhachHangCheckin;
import com.example.datn.service.IMPL.KhachHangCheckinServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("khach-hang-checkin")
public class KhachHangCheckinController {
    @Autowired
    KhachHangCheckinServiceIMPL khachHangCheckinServiceIMPL;

    @GetMapping("hien-thi")
    public ResponseEntity<List<KhachHangCheckin>> hienThi(@RequestParam String maThongTinDatPhong){
        return ResponseEntity.ok(khachHangCheckinServiceIMPL.findsByMaTTDP(maThongTinDatPhong));
    }

    @PostMapping("them")
    public ResponseEntity<KhachHangCheckin> them(@RequestBody KhachHangCheckinRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangCheckinServiceIMPL.add(request));
    }


}
