package com.example.datn.controller;

import com.example.datn.model.DichVu;
import com.example.datn.model.XepPhong;
import com.example.datn.service.IMPL.DichVuServiceIMPL;
import com.example.datn.service.IMPL.XepPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/xep_phong")
public class XepPhongController {

    @Autowired
    XepPhongServiceIMPL xepPhongServiceIMPL;

    @GetMapping("")
    public List<XepPhong> dichVuHome() {
        return xepPhongServiceIMPL.getAll();
    }
}