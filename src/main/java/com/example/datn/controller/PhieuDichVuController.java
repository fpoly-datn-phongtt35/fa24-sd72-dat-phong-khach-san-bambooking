package com.example.datn.controller;

import com.example.datn.dto.request.DichVuSuDungRequest;
import com.example.datn.model.DichVuSuDung;

import com.example.datn.service.IMPL.DichVuServiceIMPL;
import com.example.datn.service.IMPL.PhieuDichVuServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/phieu_dich_vu")
public class PhieuDichVuController {
    @Autowired
    PhieuDichVuServiceIMPL phieuDichVuServiceIMPL;
    @Autowired
    DichVuServiceIMPL dichVuServiceIMPL;

    @GetMapping("")
    public List<DichVuSuDung> dichVuHome() {
        return phieuDichVuServiceIMPL.getAll();
    }

    @PostMapping("add")
    public ResponseEntity<?> createDichVuDikem(@RequestBody DichVuSuDungRequest dichVuSuDungRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phieuDichVuServiceIMPL.addPhieuDichVu(dichVuSuDungRequest));
    }
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody DichVuSuDungRequest dichVuSuDungRequest) {
        DichVuSuDung updateDichVuSuDung = phieuDichVuServiceIMPL.updatePhieuDichVu(dichVuSuDungRequest);
        return ResponseEntity.ok(updateDichVuSuDung);
    }
    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable("id") Integer id) {
        phieuDichVuServiceIMPL.deletePhieuDichVu(id);
        return "redirect:/phieu_dich_vu";
    }

}
