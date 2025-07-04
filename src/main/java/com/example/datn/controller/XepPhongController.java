package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.dto.response.XepPhongResponse;
import com.example.datn.model.XepPhong;
import com.example.datn.service.IMPL.XepPhongServiceIMPL;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
//@CrossOrigin("*")
@RequestMapping("xep-phong")
public class XepPhongController {
    @Autowired
    XepPhongServiceIMPL xepPhongServiceIMPL;

    @GetMapping("")
    public List<XepPhong> home(){
        return xepPhongServiceIMPL.getAll();
    }
    @PostMapping("add")
    public ResponseEntity<XepPhong> addXepPhong(@RequestBody XepPhongRequest xepPhongRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(xepPhongServiceIMPL.addXepPhong(xepPhongRequest));
    }
    @GetMapping("phong-da-xep")
    public ResponseEntity<XepPhong> phongDaXep(@RequestParam("maThongTinDatPhong") String maThongTinDatPhong){
        return ResponseEntity.status(HttpStatus.OK).body(xepPhongServiceIMPL.getByMaTTDP(maThongTinDatPhong));
    }

    @PutMapping("check-in")
    public ResponseEntity<XepPhong> checkIn(@RequestBody XepPhongRequest xepPhongRequest){
        return ResponseEntity.status(HttpStatus.OK).body(xepPhongServiceIMPL.checkIn(xepPhongRequest));
    }

    @GetMapping("test")
    public ResponseEntity<List<XepPhong>> tesst(@RequestParam("key") String key){
        return ResponseEntity.status(HttpStatus.OK).body(xepPhongServiceIMPL.findByKey(key));

    }

    @GetMapping("thong-tin-xep-phong")
    public ResponseEntity<?> ttXepPhong(){
        return ResponseEntity.status(HttpStatus.OK).body(xepPhongServiceIMPL.getAll());
    }

    @GetMapping("/by-thong-tin/{id}")
    public ResponseEntity<?> getXepPhongByThongTinDatPhongId(@PathVariable Integer id) {
        Optional<XepPhong> xepPhong = xepPhongServiceIMPL.getXepPhongByThongTinDatPhongId(id);
        return xepPhong.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<XepPhong> getXepPhongById(@PathVariable Integer id) {
        XepPhong xepPhong = xepPhongServiceIMPL.getById(id);
        return ResponseEntity.ok(xepPhong);
    }

    @PutMapping("/update")
    public ResponseEntity<XepPhong> updateXepPhong(@RequestBody XepPhongRequest xepPhongRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(xepPhongServiceIMPL.updateXepPhong(xepPhongRequest));
    }
}
