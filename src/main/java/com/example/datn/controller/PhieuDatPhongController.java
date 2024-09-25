package com.example.datn.controller;

import com.example.datn.model.DatPhong;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.LoaiPhongRepository;
import com.example.datn.repository.DatPhongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
public class PhieuDatPhongController {
    @Autowired
    DatPhongRepository datPhongRepository;
    @Autowired
    KhachHangRepository khachHangRepository;
    @Autowired
    LoaiPhongRepository loaiPhongRepository;


    @GetMapping("/phieu-dat-phong")
    public String hienThi(Model model){
        model.addAttribute("list", datPhongRepository.findAll());
        return "phieu_dat_phong/index";
    }

    @GetMapping("/phieu-dat-phong/insert")
    public String insert(Model model){
        model.addAttribute("listKhachHang", khachHangRepository.findAll());
        return "phieu_dat_phong/add";
    }

    @PostMapping("/phieu-dat-phong/add")
    public String add(@ModelAttribute("phieuDatPhong") DatPhong datPhong){
        datPhong.setThoiGianDat(LocalDateTime.now());
        datPhongRepository.save(datPhong);
        return "redirect:/phieu-dat-phong";
    }

    @PostMapping("/phieu-dat-phong/detail")
    public String detail(@RequestParam("id") Integer id, Model model) {
        DatPhong datPhong = datPhongRepository.findById(id).orElse(null);

        if (datPhong == null) {
            return "redirect:/phieu-dat-phong";
        }

        model.addAttribute("phieuDatPhong", datPhong);
        model.addAttribute("listKhachHang", khachHangRepository.findAll());
        model.addAttribute("listLoaiPhong", loaiPhongRepository.findAll());

        // Chuyển đổi LocalDateTime sang định dạng chuỗi để gửi đến view
        model.addAttribute("formattedThoiGianVaoDuKien",
                (datPhong.getThoiGianVaoDuKien() != null) ?
                        datPhong.getThoiGianVaoDuKien().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")) : "");

        model.addAttribute("formattedThoiGianRaDuKien",
                (datPhong.getThoiGianRaDuKien() != null) ?
                        datPhong.getThoiGianRaDuKien().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm")) : "");
        model.addAttribute("list", datPhongRepository.findAll());

        return "phieu_dat_phong/index";
    }

    @PostMapping("/phieu-dat-phong/update")
    public String update(@ModelAttribute("phieuDatPhong") DatPhong datPhong){
        datPhong.setThoiGianDat(LocalDateTime.now());
        datPhongRepository.save(datPhong);
        return "redirect:/phieu-dat-phong";
    }

    @GetMapping("/phieu-dat-phong/delete")
    public String delete(@RequestParam("id") Integer id){
        datPhongRepository.deleteById(id);
        return "redirect:/phieu-dat-phong";
    }

    @GetMapping("/phieu_dat_phong/search")
    public String search(@RequestParam("maDatPhong") String ma, Model model){
        List<DatPhong> listNew = datPhongRepository.getPhieuDatPhongByMaDatPhong(ma);
        model.addAttribute("list", listNew);
        return "phieu_dat_phong/index";
    }
}
