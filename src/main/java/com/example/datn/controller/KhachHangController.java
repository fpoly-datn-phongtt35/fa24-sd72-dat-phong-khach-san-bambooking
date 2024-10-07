package com.example.datn.controller;

import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.KhachHang;
import com.example.datn.service.IMPL.KhachHangServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/khach-hang")
public class KhachHangController {
    @Autowired
    KhachHangServiceIMPL khachHangServiceIMPL;

    @GetMapping("hien-thi")
    public ResponseEntity<?> HienThiKhachHang() {
        List<KhachHang> kh = khachHangServiceIMPL.getAll();
        return ResponseEntity.ok(kh);
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
