package com.example.datn.controller;


import com.example.datn.model.LoaiPhong;
import com.example.datn.service.IMPL.LoaiPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/loai-phong")
public class LoaiPhongController {
    @Autowired
    LoaiPhongServiceIMPL phongServiceIMPL;
    @GetMapping("/home")
    public List<LoaiPhong> home(){
        return phongServiceIMPL.getAll();
    }

}
