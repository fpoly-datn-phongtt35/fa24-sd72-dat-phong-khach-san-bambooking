package com.example.datn.service.IMPL;

import com.example.datn.config.PasswordGenerator;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.response.KhachHangResponse;
import com.example.datn.mapper.KhachHangMapper;
import com.example.datn.model.KhachHang;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.KhachHangService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class KhachHangServiceIMPL implements KhachHangService {
    KhachHangRepository khachHangRepository;
    TaiKhoanRepository taiKhoanRepository;
    KhachHangMapper khachHangMapper;
    @Autowired
    JavaMailSender mailSender;

    @Override
    public Page<KhachHang> getAllKhachHang(Pageable pageable) {
        return khachHangRepository.findAll(pageable);
    }

    @Override
    public KhachHang createKhachHang(KhachHangRequest request) {
        TaiKhoan taiKhoan = new TaiKhoan();
        taiKhoan.setTenDangNhap(request.getEmail());

        String generatedPassword = PasswordGenerator.generateRandomPassword();
        taiKhoan.setMatKhau(generatedPassword);
        taiKhoan.setTrangThai("active");
        TaiKhoan saveTaiKhoan = taiKhoanRepository.save(taiKhoan);

        KhachHang khachHang = khachHangMapper.toKhachHang(request);
        khachHang.setTaiKhoan(saveTaiKhoan);
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai("active");
        return khachHangRepository.save(khachHang);
    }

    @Override
    public KhachHangResponse getOneKhachHang(Integer id) {
        KhachHang khachHang = khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID khach hang not found: " + id));

        return khachHangMapper.toKhachHangResponse(khachHang);
    }

    @Override
    public KhachHangResponse updateKhachHang(Integer id, KhachHangRequest request) {
        KhachHang khachHang = khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID khach hang not found: " + id));
        khachHang.setHo(request.getHo());
        khachHang.setTen(request.getTen());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setDiaChi(request.getDiaChi());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
        khachHang.setTrangThai(request.getTrangThai());
        khachHang.setNgaySua(LocalDateTime.now());

        KhachHang updateKH = khachHangRepository.save(khachHang);

        TaiKhoan taiKhoan = updateKH.getTaiKhoan();
        if (taiKhoan != null) {
            taiKhoan.setTenDangNhap(request.getEmail());
            taiKhoanRepository.save(taiKhoan);
        }
        return khachHangMapper.toKhachHangResponse(updateKH);
    }

    @Override
    public void deleteKhachHang(Integer id) {
        KhachHang khachHang = khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID khach hang not found: " + id));

        khachHangRepository.delete(khachHang);
    }

    @Override
    public Page<KhachHang> searchKhachHang(String keyword, Pageable pageable) {
        return khachHangRepository.search(keyword, pageable);
    }

    @Override
    public KhachHang findByEmail(String email) {
        KhachHang khachHang = khachHangRepository.findByEmail(email);
        if (khachHang == null) {
            throw new RuntimeException("Không tìm thấy khách hàng với email: " + email);
        }
        return khachHang;
    }

    @Override
    public void sendPasswordEmail(String email, String generatedPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);  // Gửi tới email người dùng nhập
        message.setSubject("Mật khẩu đăng ký của bạn");
        message.setText("Mật khẩu của bạn là: " + generatedPassword);

        try {
            mailSender.send(message);
            System.out.println("Email đã được gửi thành công tới: " + email);
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi email: " + e.getMessage());
        }
    }

    @Override
    public String generatePassword() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(characters.length());
            password.append(characters.charAt(index));  // Thêm ký tự ngẫu nhiên vào mật khẩu
        }

        return password.toString();
    }

}
