package com.example.datn.controller;

import com.example.datn.model.DichVu;
import com.example.datn.model.NhanVien;
import com.example.datn.service.IMPL.DichVuServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/dich_vu")
public class DichVuController {

    @Autowired
    DichVuServiceIMPL dichVuServiceIMPL;

    @GetMapping("")
    public List<DichVu> dichVuHome() {
        return dichVuServiceIMPL.getAll();
    }

    @GetMapping("/dich-vu/view-add")
    public String view_add(Model model) {
        model.addAttribute("dichVu", new DichVu());
        return "/dichVu/add";
    }


    @PostMapping("add")
    public ResponseEntity<?> createDatPhong(@RequestBody DichVu dichVu) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dichVuServiceIMPL.addDichVu(dichVu));
    }

    @DeleteMapping("/delete/{id}") // Thêm phương thức xóa
    public String delete(@PathVariable("id") Integer id) {
        dichVuServiceIMPL.deleteDichVu(id);
        return "redirect:/dich-vu"; // Chuyển hướng sau khi xóa
    }

    @GetMapping("/dich-vu/detail/{id}")
    public DichVu detail(@PathVariable("id") Integer id) {
        return dichVuServiceIMPL.findById(id);
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody DichVu dichVu) {
        DichVu updatedDichVu = dichVuServiceIMPL.updateDichVu(dichVu);
        return ResponseEntity.ok(updatedDichVu);
    }


    @GetMapping("/dich-vu/status/{id}")
    public String status(@PathVariable("id") Integer id) {
        dichVuServiceIMPL.updateStatus(id);
        return "redirect:/dich-vu";
    }



}
