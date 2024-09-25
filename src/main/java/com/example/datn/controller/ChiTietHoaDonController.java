package com.example.datn.controller;

import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.HoaDon;
import com.example.datn.model.PhieuDichVu;
import com.example.datn.model.Phong;
import com.example.datn.service.IMPL.ThongTinDatPhongServiceIMPL;
import com.example.datn.service.IMPL.HoaDonServiceIMPL;
import com.example.datn.service.IMPL.PhieuDichVuServiceIMPL;
import com.example.datn.service.IMPL.PhongServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/chi-tiet-hoa-don")
public class ChiTietHoaDonController {

    @Autowired
    ThongTinDatPhongServiceIMPL chiTietHoaDonServiceIMPL;
    @Autowired
    PhieuDichVuServiceIMPL phieuDichVuServiceIMPL;
    @Autowired
    HoaDonServiceIMPL hoaDonServiceIMPL;
    @Autowired
    PhongServiceIMPL phongServiceIMPL;
    @ModelAttribute("listPhieuDichVu")
    List<PhieuDichVu> getAllPhieuDichVu(){
        return phieuDichVuServiceIMPL.findAll();
    }
    @ModelAttribute("listHoaDon")
    List<HoaDon> getAllHoaDon() {
        return hoaDonServiceIMPL.findAll();
    }
    @ModelAttribute("listPhong")
    List<Phong> getAllPhong() {
        return phongServiceIMPL.getAll();
    }


    @GetMapping("")
    public String chiTietHoaDonIndex(Model model){
        List<ThongTinDatPhong> list = chiTietHoaDonServiceIMPL.findAll();
        model.addAttribute("list", list);
        return "/cthd/index";
    }

    @GetMapping("/view-add")
    public String viewAddCTHD(Model model){
        model.addAttribute("chiTietHoaDon", new ThongTinDatPhong());
        return "/cthd/add";
    }

    @PostMapping("/add")
    public String addCTHD(@ModelAttribute("chiTietHoaDon") ThongTinDatPhong thongTinDatPhong){
        chiTietHoaDonServiceIMPL.add(thongTinDatPhong);
        return "redirect:/chi-tiet-hoa-don";
    }

    @GetMapping("/detail/{id}")
    public String deltaiCTHD(@PathVariable("id") Integer id, Model model){
        ThongTinDatPhong thongTinDatPhongDetail = chiTietHoaDonServiceIMPL.detail(id);
        model.addAttribute("cthdDetail", thongTinDatPhongDetail);
        return "/cthd/update";
    }

    @PostMapping("/update")
    public String updateCTHD(@ModelAttribute("chiTietHoaDon") ThongTinDatPhong thongTinDatPhong){
        chiTietHoaDonServiceIMPL.update(thongTinDatPhong);
        return "redirect:/chi-tiet-hoa-don";
    }

    @GetMapping("/delete/{id}")
    public String deleteCTHD(@PathVariable("id") Integer id){
        chiTietHoaDonServiceIMPL.delete(id);
        return "redirect:/chi-tiet-hoa-don";
    }
}
