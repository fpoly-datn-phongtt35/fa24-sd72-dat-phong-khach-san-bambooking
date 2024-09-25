package com.example.datn.controller;

import com.example.datn.model.NhanVien;
import com.example.datn.service.IMPL.NhanVienServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
@CrossOrigin
@RestController
public class NhanVienController {
    @Autowired
    NhanVienServiceIMPL nhanVienServiceIMPL;

    @GetMapping("/nhan-vien")
    public List<NhanVien> nhanVienHome() {
        return nhanVienServiceIMPL.getAll();
    }

    @GetMapping("/nhan-vien/view-add")
    public String view_add(Model model) {
        model.addAttribute("nhanVien", new NhanVien());
        return "/nhanVien/add";
    }

    @PostMapping("/nhan-vien/add")
    public String add(@ModelAttribute("nhanVien") NhanVien nhanVien) {
        LocalDateTime now = LocalDateTime.now();
        nhanVien.setNgayTao(now);
        nhanVien.setNgaySua(now);
        nhanVienServiceIMPL.addNhanVien(nhanVien);
        return "redirect:/nhan-vien";
    }

    @GetMapping("/nhan-vien/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        NhanVien nhanVienDetail = nhanVienServiceIMPL.findById(id);
        model.addAttribute("nvdetail", nhanVienDetail);
        return "/nhanVien/update";
    }
    @PostMapping("/nhan-vien/update")
    public String update(@ModelAttribute("nhanVien") NhanVien nhanVien) {
        nhanVienServiceIMPL.updateNhanVien(nhanVien);
        return "redirect:/nhan-vien";
    }

    @GetMapping("/nhan-vien/status/{id}")
    public String status(@PathVariable("id") Integer id) {
        nhanVienServiceIMPL.updateTrangThaiNhanVien(id);
        return "redirect:/nhan-vien";
    }

    @GetMapping("/nhan-vien/search")
    public String search(@RequestParam(name = "keyword", required = false) String keyword, Model model) {
        List<NhanVien> list;

        if (keyword != null && !keyword.isEmpty()) {
            list = nhanVienServiceIMPL.search(keyword);
        } else {
            list = nhanVienServiceIMPL.getAll();
        }
        model.addAttribute("list", list);
        return "nhanVien/index";
    }


}
