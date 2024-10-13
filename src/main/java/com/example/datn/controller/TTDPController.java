package com.example.datn.controller;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
import com.example.datn.utilities.UniqueDatPhongCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/ttdp")
public class TTDPController {
    @Autowired
    ThongTinDatPhongServiceIMPL thongTinDatPhongServiceIMPL;

    @PostMapping("them-moi")
    public ResponseEntity<?> createDatPhong(@RequestBody TTDPRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(thongTinDatPhongServiceIMPL.add(request));
    }
}
