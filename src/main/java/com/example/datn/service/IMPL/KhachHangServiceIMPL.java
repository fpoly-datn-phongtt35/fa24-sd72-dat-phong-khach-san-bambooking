package com.example.datn.service.IMPL;

import com.example.datn.config.PasswordGenerator;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.response.KhachHangResponse;
import com.example.datn.mapper.KhachHangMapper;
import com.example.datn.model.KhachHang;
import com.example.datn.model.KhachHangRegister;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.EmailService;
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
    KhachHangMapper khachHangMapper;
    @Autowired
    JavaMailSender mailSender;

    @Autowired
    private EmailService emailService;

    @Override
    public Page<KhachHang> getAllKhachHang(Pageable pageable) {
        return khachHangRepository.findAll(pageable);
    }

    @Override
    public KhachHang createKhachHang(KhachHangRequest request) {
        // Tạo mật khẩu ngẫu nhiên
        String generatedPassword = PasswordGenerator.generateRandomPassword();

        // Tạo đối tượng KhachHang và gán thông tin
        KhachHang khachHang = khachHangMapper.toKhachHang(request);
        khachHang.setEmail(request.getEmail());
        //khachHang.setMatKhau(generatedPassword); // Lưu mật khẩu vào bảng KhachHang
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(false); // Tài khoản chưa kích hoạt

        // Lưu khách hàng vào cơ sở dữ liệu
        KhachHang savedKhachHang = khachHangRepository.save(khachHang);

        // Gửi mật khẩu qua email
        sendPasswordEmail(request.getEmail(), generatedPassword);

        return savedKhachHang;
    }

    @Override
    public KhachHang createKhachHangRegister(KhachHangRegister request) {
        String generatedPassword = PasswordGenerator.generateRandomPassword();

        // Tạo đối tượng KhachHang và gán thông tin
        KhachHang khachHang = new KhachHang();
        khachHang.setEmail(request.getEmail());
        //khachHang.setMatKhau(generatedPassword); // Lưu mật khẩu vào DB
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(true);

        // Lưu vào DB
        KhachHang savedKhachHang = khachHangRepository.save(khachHang);

        // Gửi mật khẩu qua email
        sendPasswordEmail(request.getEmail(), generatedPassword);

        return savedKhachHang;
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
        khachHang.setTrangThai(request.isTrangThai());
        khachHang.setNgaySua(LocalDateTime.now());

        KhachHang updateKH = khachHangRepository.save(khachHang);

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

    @Override
    public boolean checkLogin(String email, String matKhau) {
        Optional<KhachHang> khachHang = khachHangRepository.findByEmail(email);
        return khachHang.isPresent() && khachHang.get().equals(matKhau);
    }

    @Override
    public KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request) {
        KhachHang khachHang = new KhachHang();
        khachHang.setTen(request.getTen());
        khachHang.setHo(request.getHo());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setDiaChi(request.getDiaChi());
        //khachHang.setMatKhau(request.getMatKhau());
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(request.getTrangThai());
        return khachHangRepository.save(khachHang);

    }

    @Override
    public Optional<KhachHang> KhachHangLogin(String email) {
        Optional<KhachHang> khachHang = khachHangRepository.findByEmail(email);
        return khachHang;
    }
}
