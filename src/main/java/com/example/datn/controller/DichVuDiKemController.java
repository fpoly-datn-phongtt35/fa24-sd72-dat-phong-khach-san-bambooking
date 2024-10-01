package com.example.datn.controller;

import com.example.datn.model.DichVuDiKem;
import com.example.datn.service.IMPL.DichVuDiKemServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/dich_vu_di_kem")
public class DichVuDiKemController {
    @Autowired
    DichVuDiKemServiceIMPL dichVuDiKemServiceIMPL;

    @GetMapping("")
    public ResponseEntity<?> dichVuDiKemHome() {
        return ResponseEntity.ok(dichVuDiKemServiceIMPL.getAll());
    }
}
