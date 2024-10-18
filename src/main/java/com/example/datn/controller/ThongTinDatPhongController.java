package com.example.datn.controller;

import com.example.datn.model.DichVu;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.service.IMPL.DichVuServiceIMPL;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/thong_tin_dat_phong")
public class ThongTinDatPhongController {

    @Autowired
    ThongTinDatPhongServiceIMPL thongTinDatPhongServiceIMPL;

    @GetMapping("")
    public List<ThongTinDatPhong> ThongTinDatPhongHome() {
        return thongTinDatPhongServiceIMPL.getAll();
    }
}
