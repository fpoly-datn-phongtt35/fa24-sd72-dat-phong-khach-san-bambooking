package com.example.datn.controller;

import com.example.datn.model.DichVu;
import com.example.datn.model.NhanVien;
import com.example.datn.repository.DichVuDiKemRepository;
import com.example.datn.repository.DichVuSuDungRepository;
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
import java.util.Map;

//@CrossOrigin("*")
@RestController
@RequestMapping("/dich_vu")
public class DichVuController {

    @Autowired
    DichVuServiceIMPL dichVuServiceIMPL;
    @Autowired
    DichVuSuDungRepository dichVuSuDungRepository;
    @Autowired
    DichVuDiKemRepository dichVuDiKemRepository;

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
    public String createDichVu(@RequestParam("tenDichVu") String tenDichVu,
                           @RequestParam("donGia") Double donGia,
                           @RequestParam("moTa") String moTa,
                           @RequestParam("hinhAnh") MultipartFile file,
                           @RequestParam("trangThai") String  trangThai
                           ) {
    try {
            DichVu dichVu = new DichVu();
            dichVu.setTenDichVu(tenDichVu);
            dichVu.setDonGia(donGia);
            dichVu.setMoTa(moTa);
            boolean trangThaiBoolean = Boolean.parseBoolean(trangThai);
            dichVu.setTrangThai(trangThaiBoolean);
            DichVu savedDichVu = dichVuServiceIMPL.addDichVu(dichVu, file);
            return "Dịch vụ đã được tạo thành công: " + savedDichVu.getId();
        } catch (IOException e) {
            return "Lỗi khi tạo dịch vụ: " + e.getMessage();
    }
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable("id") Integer id) {
        dichVuServiceIMPL.deleteDichVu(id);
        return "redirect:/dich-vu";
    }

    @GetMapping("/check/{id}")
    public ResponseEntity<Map<String, Boolean>> checkDichVu(@PathVariable("id") Integer id) {
        boolean isUsed = dichVuSuDungRepository.existsByDichVu_Id(id) || dichVuDiKemRepository.existsByDichVu_Id(id);
        return ResponseEntity.ok(Map.of("isUsed", isUsed));
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
            @RequestParam(value = "hinhAnh", required = false) MultipartFile file,
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
            existingDichVu.setTrangThai(Boolean.parseBoolean(trangThai));

            // Chỉ cập nhật hình ảnh nếu có file được gửi
            if (file != null && !file.isEmpty()) {
                // Gọi hàm cập nhật hình ảnh
                existingDichVu = dichVuServiceIMPL.updateDichVu(existingDichVu, file);
            } else {
                // Không thay đổi hình ảnh, chỉ cần lưu lại thông tin đã cập nhật
                // Ở đây bạn có thể sử dụng lại phương thức updateDichVu
                existingDichVu = dichVuServiceIMPL.updateDichVu(existingDichVu, null); // Gửi null cho hình ảnh
            }

            return ResponseEntity.ok(existingDichVu);
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
