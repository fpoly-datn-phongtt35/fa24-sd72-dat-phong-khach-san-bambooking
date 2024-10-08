package com.example.datn.controller;


import com.example.datn.model.LoaiPhong;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/loai_phong")
public class LoaiPhongController {
    @Autowired
    LoaiPhongServiceIMPL phongServiceIMPL;

    @GetMapping("")
    public List<LoaiPhong> loaiPhongHome() {
        return phongServiceIMPL.getAll();
    }

}
