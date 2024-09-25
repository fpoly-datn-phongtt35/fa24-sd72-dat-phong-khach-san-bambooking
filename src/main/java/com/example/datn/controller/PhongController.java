package com.example.datn.controller;

import com.example.datn.model.Phong;
import com.example.datn.service.IMPL.PhongServiceIMPL;
import com.example.datn.service.PhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/phong")
public class PhongController {
    @Autowired
    PhongServiceIMPL phongServiceIMPL;

    @GetMapping("/home")
    public List<Phong> home(){
        return phongServiceIMPL.getAll();
    }

    @PostMapping("/add")
    public String add(Phong phong){
        phongServiceIMPL.add(phong);
        return "redirect:/phong/home";
    }

    @PostMapping("/update")
    public String update(Phong phong){
        phongServiceIMPL.update(phong);
        return "redirect:/phong/home";
    }

    @GetMapping("/update-status")
    public String updateStatus(@RequestParam("id") int id){
        phongServiceIMPL.updateStatusPhong(id);
        return "redirect:/phong/home";
    }

    @ModelAttribute("listTinhTrang")
    public List<String> tinhTrang(Model model){
        List<String> list = Arrays.asList("Trống", "Đã đặt phòng", "Có khách");
        return list;
    }
}
