package com.example.datn.controller;

import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.model.KhachHang;
import com.example.datn.model.KhachHangRegister;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.service.IMPL.HotelWebsiteServiceImpl;
import com.example.datn.service.IMPL.KhachHangServiceIMPL;
import com.example.datn.service.KhachHangService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/khach-hang")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KhachHangController {
    @Autowired
    KhachHangRepository khachHangRepository;
    KhachHangService khachHangService;
    KhachHangServiceIMPL khachHangServiceIMPL;

    HotelWebsiteServiceImpl hotelWebsiteServiceIMPL;
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody KhachHangRegister request) {
//        boolean isAuthenticated = khachHangService.checkLogin(request.getEmail(), request.getMatKhau());
//
//        if (isAuthenticated) {
//            return ResponseEntity.ok("Đăng nhập thành công!");
//        } else {
//            return ResponseEntity.status(401).body("Email hoặc mật khẩu không chính xác.");
//        }
//    }

//    @GetMapping("")
//    public ResponseEntity<?> getAllKhachHang(Pageable pageable){
//        return ResponseEntity.ok(khachHangService.getAllKhachHang(pageable));
//    }
//
//    @PostMapping("")
//    public ResponseEntity<?> createKhachHang(@RequestBody @Valid KhachHangRequest request){
//        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangService.createKhachHang(request));
//    }
//
//    @GetMapping("{id}")
//    public ResponseEntity<?> getOneKhachHang(@PathVariable("id") Integer id){
//        return ResponseEntity.ok(khachHangService.getOneKhachHang(id));
//    }
//
//    @PutMapping("{id}")
//    public ResponseEntity<?> updateKhachHang(@PathVariable("id") Integer id, @RequestBody @Valid KhachHangRequest request){
//        return ResponseEntity.status(HttpStatus.OK).body(khachHangService.updateKhachHang(id, request));
//    }
//
//    @DeleteMapping("{id}")
//    public ResponseEntity<?> deleteKhachHang(@PathVariable("id") Integer id){
//        khachHangService.deleteKhachHang(id);
//        return ResponseEntity.ok("Xóa khách hàng có id: " + id + "thành công !");
//    }
//
//    @GetMapping("/search")
//    public ResponseEntity<?> searchKhachHang(@RequestParam(value = "keyword", required = false) String keyword, Pageable pageable){
//        return ResponseEntity.status(HttpStatus.OK).body(khachHangService.searchKhachHang(keyword, pageable));
//    }
//

    @GetMapping("/get-by-key")
    public ResponseEntity<?> getKhachHangByKey(@RequestParam(value = "trangThai", required = false) Boolean trangThai,
                                               @RequestParam(value = "keyword", required = false) String keyword,Pageable pageable){
        Page<KhachHang> khs = khachHangServiceIMPL.getKhachHangsByKey(trangThai ,keyword,pageable);
        return ResponseEntity.status(HttpStatus.OK).body(khs);
    }
    @PostMapping("/create-kh-dp")
    public ResponseEntity<?> createKhachHangDatPhong(@RequestBody KhachHangDatPhongRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangService.createKhachHangDatPhong(request));
    }

    @PutMapping("/update-kh-dp")
    public ResponseEntity<?> updateKhachHangDatPhong(@RequestBody KhachHangDatPhongRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(khachHangService.updateKhachHangDatPhong(request));
    }

    @DeleteMapping("delete-kh-dp")
    public ResponseEntity<?> deleteKhachHangDatPhong(@RequestParam Integer kh) {
        try {
            khachHangService.deleteKhachHangDatPhong(kh);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Khách hàng không tồn tại.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi trong quá trình xóa khách hàng.");
        }
    }

    @PutMapping("/sua-tt-kh")
    public ResponseEntity<?> updateKhachHang(@RequestBody KhachHangDatPhongRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelWebsiteServiceIMPL.updateKhachHang(request));
    }



//    @PostMapping("/send-email")
//    public ResponseEntity<String> sendVerificationEmail(@RequestBody KhachHangRegister request) {
//        // Kiểm tra xem email đã tồn tại chưa
//        Optional<KhachHang> existingCustomer = khachHangRepository.findByEmail(request.getEmail());
//        if (existingCustomer.isPresent()) {
//            return ResponseEntity.badRequest().body("Email đã được sử dụng. Vui lòng đăng nhập.");
//        }
//
//        // Gửi email chứa mật khẩu tạm thời
//        String tempPassword = khachHangService.generatePassword();
//        khachHangService.sendPasswordEmail(request.getEmail(), tempPassword);
//
//        // Lưu mật khẩu tạm thời vào cơ sở dữ liệu (tạo trước đối tượng nhưng chưa kích hoạt)
//        KhachHang newCustomer = new KhachHang();
//        newCustomer.setEmail(request.getEmail());
//        newCustomer.setTrangThai(false);  // Chưa kích hoạt tài khoản
//        newCustomer.setNgayTao(LocalDateTime.now());
//        newCustomer.setNgaySua(LocalDateTime.now());
//
//        khachHangRepository.save(newCustomer);
//
//        return ResponseEntity.ok("Mật khẩu đã được gửi qua email.");
//    }
//
//    // 2. Endpoint hoàn tất đăng ký
//    @PostMapping("/register")
//    public ResponseEntity<String> registerCustomer(@RequestBody KhachHangRegister request) {
//        // Kiểm tra xem email đã tồn tại và chưa kích hoạt
//        Optional<KhachHang> existingCustomer = khachHangRepository.findByEmail(request.getEmail());
//        if (existingCustomer.isEmpty() || existingCustomer.get().isTrangThai()) {
//            return ResponseEntity.badRequest().body("Email không hợp lệ hoặc đã đăng ký.");
//        }
//
//        // Cập nhật mật khẩu mới và kích hoạt tài khoản
//        KhachHang customer = existingCustomer.get();
//        customer.setTrangThai(true);  // Kích hoạt tài khoản
//        customer.setNgaySua(LocalDateTime.now());
//
//        khachHangRepository.save(customer);
//
//        return ResponseEntity.ok("Đăng ký thành công! Bạn có thể đăng nhập.");
//    }
}
