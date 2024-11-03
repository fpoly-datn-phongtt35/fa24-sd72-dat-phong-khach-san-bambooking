package com.example.datn.controller;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.response.DichVuDiKemResponse;
import com.example.datn.dto.response.TienIchPhongResponse;
import com.example.datn.model.DichVu;
import com.example.datn.model.DichVuDiKem;
import com.example.datn.service.IMPL.DichVuDiKemServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

@CrossOrigin("*")
@RestController
@RequestMapping("/dich_vu_di_kem")
public class DichVuDiKemController {
    @Autowired
    DichVuDiKemServiceIMPL dichVuDiKemServiceIMPL;

    @GetMapping("")
    public ResponseEntity<?> dichVuDiKemHome() {
        return ResponseEntity.ok(dichVuDiKemServiceIMPL.getAll());
    }

    @PostMapping("add")
    public ResponseEntity<?> createDichVuDikem(@RequestBody DichVuDikemRequest dichVuDikemRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dichVuDiKemServiceIMPL.addDichVuDiKem(dichVuDikemRequest));
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable("id") Integer id) {
        dichVuDiKemServiceIMPL.deleteDichVuDiKem(id);
        return "redirect:/dich-vu-di-kem";
    }

    @GetMapping("/dich-vu-di-kem/detail/{id}")
    public DichVuDiKem detail(@PathVariable("id") Integer id) {
        return dichVuDiKemServiceIMPL.findById(id);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody DichVuDikemRequest dichVuDikemRequest) {
        DichVuDiKem updateDichVuDiKem = dichVuDiKemServiceIMPL.updateDichVuDiKem(dichVuDikemRequest);
        return ResponseEntity.ok(updateDichVuDiKem);
    }

    @GetMapping("/dich-vu-di-kem/status/{id}")
    public String status(@PathVariable("id") Integer id) {
        dichVuDiKemServiceIMPL.updateStatus(id);
        return "redirect:/dich-vu-di-kem";
    }

    @GetMapping("/findByIDLoaiPhong/{idLoaiPhong}")
    public ResponseEntity<?> findByIDLoaiPhong(@PathVariable int idLoaiPhong, Pageable pageable) {
        Page<DichVuDiKemResponse> ti = dichVuDiKemServiceIMPL.findByIDLoaiPhong(idLoaiPhong, pageable);
        return ResponseEntity.ok(ti);
    }
}
