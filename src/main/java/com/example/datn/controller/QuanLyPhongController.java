package com.example.datn.controller;

import com.example.datn.model.LoaiPhong;
import com.example.datn.model.Phong;
import com.example.datn.repository.LoaiPhongRepository;
import com.example.datn.service.IMPL.PhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/QuanLyPhong")
public class QuanLyPhongController {


    @Autowired
    PhongServiceIMPL phongServiceIMPL;


    @Autowired
    LoaiPhongRepository loaiPhongRepository;

    @GetMapping("/Phong")
    public String home(Model model) {
        List<Phong> listPhong = new ArrayList<>();
        List<Phong> listPhong1 = new ArrayList<>();
        model.addAttribute("listLoaiPhong",loaiPhongRepository.findAll());
        for(LoaiPhong loaiPhong:loaiPhongRepository.findAll()){

            model.addAttribute("listPhong"+loaiPhong.getId(),phongServiceIMPL.findByLoaiPhong(loaiPhong.getId()));
            System.out.println("listPhong"+loaiPhong.getId());
            if(loaiPhong.getId()==1){
                listPhong1 = phongServiceIMPL.findByLoaiPhong(loaiPhong.getId());
            }
        }

        for(Phong p:listPhong1){
            System.out.println(p.getId());
            System.out.println(p.getMaPhong());
            System.out.println(p.getTenPhong());
        }
        return "/GiaoDienTaiQuay/QuanLyPhong";
    }


}

