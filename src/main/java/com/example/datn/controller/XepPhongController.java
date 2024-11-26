package com.example.datn.controller;

import com.example.datn.dto.request.XepPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.XepPhong;
import com.example.datn.service.IMPL.XepPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
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
}
