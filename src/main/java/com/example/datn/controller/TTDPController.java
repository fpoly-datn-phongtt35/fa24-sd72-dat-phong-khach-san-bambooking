package com.example.datn.controller;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.request.TTDPRequest;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
import com.example.datn.utilities.UniqueDatPhongCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin("*")
@RestController
@RequestMapping("/ttdp")
public class TTDPController {
    @Autowired
    ThongTinDatPhongServiceIMPL thongTinDatPhongServiceIMPL;

    @GetMapping("all")
    public Page<ThongTinDatPhong> all(Pageable pageable){
        return thongTinDatPhongServiceIMPL.getAll(pageable);
    }

    @GetMapping("hien-thi")
    public Page<ThongTinDatPhong> getByIDDP(@RequestParam(value = "idDP") Integer idDP,Pageable pageable){
        return thongTinDatPhongServiceIMPL.getByIDDP(idDP,pageable);
    }
    @PostMapping("them-moi")
    public ResponseEntity<?> createDatPhong(@RequestBody TTDPRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(thongTinDatPhongServiceIMPL.add(request));
    }

}
