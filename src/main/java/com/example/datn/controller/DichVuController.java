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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin("*")
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


//    @PostMapping("add")
//    public ResponseEntity<?> createDichVu(@RequestBody DichVu dichVu) {
//        return ResponseEntity.status(HttpStatus.CREATED).body(dichVuServiceIMPL.addDichVu(dichVu));
//    }
    @PostMapping("add")
    public String createDichVu(@RequestParam("tenDichVu") String tenDichVu,
                           @RequestParam("donGia") Double donGia,
                           @RequestParam("moTa") String moTa,
                           @RequestParam("hinhAnh") MultipartFile file,
                           @RequestParam("trangThai") String  trangThai
                           ) {
    try {
            // Tạo đối tượng DichVu từ các tham số
            DichVu dichVu = new DichVu();
            dichVu.setTenDichVu(tenDichVu);
            dichVu.setDonGia(donGia);
            dichVu.setMoTa(moTa);
            // Chuyển đổi từ String sang boolean
            boolean trangThaiBoolean = Boolean.parseBoolean(trangThai);
            dichVu.setTrangThai(trangThaiBoolean); // Gán giá trị đã chuyển đổi

            // Gọi service để thêm dịch vụ
            DichVu savedDichVu = dichVuServiceIMPL.addDichVu(dichVu, file);
            return "Dịch vụ đã được tạo thành công: " + savedDichVu.getId();
        } catch (IOException e) {
            return "Lỗi khi tạo dịch vụ: " + e.getMessage();
    }
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

    @PostMapping("update")
    public ResponseEntity<?> update(
            @RequestParam("id") Integer id,
            @RequestParam("tenDichVu") String tenDichVu,
            @RequestParam("donGia") Double donGia,
            @RequestParam("moTa") String moTa,
            @RequestParam("hinhAnh") MultipartFile file,
            @RequestParam("trangThai") String trangThai) {
        try {
            // Tìm dịch vụ hiện tại theo ID
            DichVu existingDichVu = dichVuServiceIMPL.findById(id);
            if (existingDichVu == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Dịch vụ không tồn tại với ID: " + id);
            }

            // Cập nhật thông tin cho đối tượng DichVu
            existingDichVu.setTenDichVu(tenDichVu);
            existingDichVu.setDonGia(donGia);
            existingDichVu.setMoTa(moTa);
            existingDichVu.setTrangThai(Boolean.parseBoolean(trangThai)); // Chuyển đổi từ String sang boolean

            // Cập nhật dịch vụ, bao gồm hình ảnh nếu có
            DichVu updatedDichVu = dichVuServiceIMPL.updateDichVu(existingDichVu, file);
            return ResponseEntity.ok(updatedDichVu);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật dịch vụ: " + e.getMessage());
        }
    }



    @GetMapping("/dich-vu/status/{id}")
    public String status(@PathVariable("id") Integer id) {
        dichVuServiceIMPL.updateStatus(id);
        return "redirect:/dich-vu";
    }



}
