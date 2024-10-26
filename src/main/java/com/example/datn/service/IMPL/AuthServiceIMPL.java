package com.example.datn.service.IMPL;

import com.example.datn.dto.request.ThongTinNhanVienRequest;
import com.example.datn.model.TaiKhoan;
import com.example.datn.model.ThongTinNhanVien;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.ThongTinNhanVienRepository;
import com.example.datn.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class AuthServiceIMPL implements AuthService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    @Autowired
    private ThongTinNhanVienRepository thongTinNhanVienRepository;



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

    @Override
    public ThongTinNhanVienRequest getThongTinNhanVien(String tenDangNhap) {
        Optional<ThongTinNhanVien> optionalThongTin =
                thongTinNhanVienRepository.findByTaiKhoan_TenDangNhap(tenDangNhap);

        if (optionalThongTin.isPresent()) {
            ThongTinNhanVien thongTin = optionalThongTin.get();

            // Chuyển đổi từ entity sang DTO
            return new ThongTinNhanVienRequest(
                    thongTin.getHo(),
                    thongTin.getTen(),
                    thongTin.getGioiTinh(),
                    thongTin.getDiaChi(),
                    thongTin.getSdt(),
                    thongTin.getEmail()
            );
        } else {
            // Nếu không tìm thấy, ném ra lỗi
            throw new RuntimeException("Không tìm thấy thông tin nhân viên cho tài khoản này");
        }
    }
}
