package com.example.datn.service.IMPL;

import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class AuthServiceIMPL implements AuthService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;


    @Override
    public TaiKhoan login(String tenDangNhap, String matKhau) {
        Optional<TaiKhoan> taiKhoanOptional = taiKhoanRepository.findByTenDangNhap(tenDangNhap);
        if (taiKhoanOptional.isPresent()) {
            TaiKhoan taiKhoan = taiKhoanOptional.get();
            // So sánh mật khẩu trực tiếp (không mã hóa)
            if (taiKhoan.getMatKhau().equals(matKhau)) {
                return taiKhoan;  // Đăng nhập thành công, trả về thông tin tài khoản
            }
        }
        return null;
    }

    @Override
    public TaiKhoan register(TaiKhoan taiKhoan) {
        return taiKhoanRepository.save(taiKhoan);
    }
}
