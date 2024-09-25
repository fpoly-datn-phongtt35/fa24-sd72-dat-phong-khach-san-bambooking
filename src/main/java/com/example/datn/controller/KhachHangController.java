package com.example.datn.controller;

import com.example.datn.model.KhachHang;
import com.example.datn.service.IMPL.KhachHangServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class KhachHangController {
    @Autowired
    KhachHangServiceIMPL khachHangServiceIMPL;

    @GetMapping("/khach-hang")
    public String khachHangHom(Model model) {
        List<KhachHang> list = khachHangServiceIMPL.getAll();
        model.addAttribute("list", list);
        return "/KhachHang/index";
    }
    @GetMapping("/khach-hang/view-add")
    public String view_add(Model model) {
        model.addAttribute("khachHang", new KhachHang());
        return "/KhachHang/add";
    }

    @PostMapping("/khach-hang/add")
    public String add(@ModelAttribute("khachHang") KhachHang khachHang) {
        LocalDateTime now = LocalDateTime.now();
        khachHang.setNgayTao(now);
        khachHang.setNgaySua(now);
        khachHangServiceIMPL.addKhachHang(khachHang);
        return "redirect:/khach-hang";
    }

    @GetMapping("/khach-hang/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        KhachHang khachHangDetail = khachHangServiceIMPL.findById(id);
        model.addAttribute("khdetail", khachHangDetail);
        return "/KhachHang/update";
    }

    @PostMapping("/khach-hang/update")
    public String update(@ModelAttribute("khachHang") KhachHang khachHang) {
        khachHangServiceIMPL.updateKhachHang(khachHang);
        return "redirect:/khach-hang";
    }

    @GetMapping("/khach-hang/status/{id}")
    public String status(@PathVariable("id") Integer id) {
        khachHangServiceIMPL.updateTrangThaiKhachHang(id);
        return "redirect:/khach-hang";
    }

    @GetMapping("/khach-hang/search")
    public String search(@RequestParam(name = "keyword", required = false) String keyword, Model model) {
        List<KhachHang> list;

        if (keyword != null && !keyword.isEmpty()) {
            list = khachHangServiceIMPL.search(keyword);
        } else {
            list = khachHangServiceIMPL.getAll();
        }
        model.addAttribute("list", list);
        return "KhachHang/index";
    }
}
