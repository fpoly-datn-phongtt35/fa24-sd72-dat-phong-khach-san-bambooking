package com.example.datn.controller;

import com.example.datn.model.PhieuDichVu;
import com.example.datn.repository.DichVuRepository;
import com.example.datn.repository.PhieuDichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Controller
public class PhieuDichVuController {
    @Autowired
    PhieuDichVuRepository phieuDichVuRepository;
    @Autowired
    DichVuRepository dichVuRepository;

    @GetMapping("/phieu-dich-vu")
    public String hienThi(Model model){
        model.addAttribute("list", phieuDichVuRepository.findAll());
        return "phieu_dich_vu/index";
    }

    @GetMapping("/phieu-dich-vu/insert")
    public String insert(Model model){
        model.addAttribute("listDichVu", dichVuRepository.findAll());
        return "phieu_dich_vu/add";
    }

    @PostMapping("/phieu-dich-vu/add")
    public String add(@ModelAttribute("phieuDichVu")PhieuDichVu phieuDichVu){
        phieuDichVuRepository.save(phieuDichVu);
        return "redirect:/phieu-dich-vu";
    }

    @PostMapping("/phieu-dich-vu/detail")
    public String detail(@RequestParam("id") Integer id, Model model){
        model.addAttribute("phieuDichVu", phieuDichVuRepository.findById(id).get());
        model.addAttribute("listDichVu", dichVuRepository.findAll());
        model.addAttribute("list", phieuDichVuRepository.findAll());
        return "phieu_dich_vu/index";
    }

    @PostMapping("/phieu-dich-vu/update")
    public String update(@ModelAttribute("phieuDichVu")PhieuDichVu phieuDichVu){
        phieuDichVuRepository.save(phieuDichVu);
        return "redirect:/phieu-dich-vu";
    }

    @GetMapping("/phieu-dich-vu/delete")
    public String delete(@RequestParam("id") Integer id){
        phieuDichVuRepository.deleteById(id);
        return "redirect:/phieu-dich-vu";
    }

    @GetMapping("/phieu-dich-vu/search")
    public String search(@RequestParam("keyword") String keyword, Model model){
        List<PhieuDichVu> listNew = phieuDichVuRepository.findByKeyword(keyword);
        model.addAttribute("list", listNew);
        return "phieu_dich_vu/index";
    }
}
