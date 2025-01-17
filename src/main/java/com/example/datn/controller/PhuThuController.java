package com.example.datn.controller;

import com.example.datn.dto.request.PhuThuRequest;
import com.example.datn.service.IMPL.PhuThuServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping("/phu_thu")
public class PhuThuController {
    @Autowired
    PhuThuServiceIMPL phuThuServiceIMPL;

    @PostMapping("add")
    public ResponseEntity<?> addPhuThu(@RequestBody PhuThuRequest phuThuRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phuThuServiceIMPL.addPhuThu(phuThuRequest));
    }
}
