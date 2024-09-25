package com.example.datn.controller;

import com.example.datn.model.NhanVien;
import com.example.datn.model.TaiKhoan;
import com.example.datn.service.IMPL.NhanVienServiceIMPL;
import com.example.datn.service.IMPL.TaiKhoanServiceIMPL;
import com.example.datn.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/tai-khoan")
public class TaiKhoanController {
    @Autowired
    TaiKhoanServiceIMPL taiKhoanServiceIMPL;
    @Autowired
    NhanVienServiceIMPL nhanVienServiceIMPL;

    @ModelAttribute("listNhanVien")
    List<NhanVien> getListNhanVien() {
        return nhanVienServiceIMPL.getAll();
    }

    @GetMapping("")
    public String home(Model model) {
        List<TaiKhoan> list = taiKhoanServiceIMPL.findAll();
        model.addAttribute("list", list);
        return "/taiKhoan/index";
    }

    @GetMapping("/view-add")
    public String viewAddTaiKhoan(Model model) {
        model.addAttribute("taiKhoan", new TaiKhoan());
        return "/taiKhoan/add";
    }

    @PostMapping("/add")
    public String addTaiKhoan(@ModelAttribute("taiKhoan") TaiKhoan taiKhoan) {
        taiKhoanServiceIMPL.addTaiKhoan(taiKhoan);
        return "redirect:/tai-khoan";
    }

    @GetMapping("/detail/{id}")
    public String detaiTaiKhoan(@PathVariable("id") Integer id, Model model){
        TaiKhoan taiKhoan = taiKhoanServiceIMPL.detailTaiKhoan(id);
        model.addAttribute("tkDetail", taiKhoan);
        return "/taiKhoan/update";
    }

    @PostMapping("/update")
    public String updateTaiKhoan(@ModelAttribute("taiKhoan") TaiKhoan taiKhoan){
        taiKhoanServiceIMPL.updateTaiKhoan(taiKhoan);
        return "redirect:/tai-khoan";
    }

    @GetMapping("/updateStatus/{id}")
    public String updateStatus(@PathVariable("id") Integer id){
        taiKhoanServiceIMPL.updateStatusTaiKhoan(id);
        return "redirect:/tai-khoan";
    }
}
