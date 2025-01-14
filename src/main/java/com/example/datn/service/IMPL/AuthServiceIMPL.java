package com.example.datn.service.IMPL;

import com.example.datn.common.TokenType;
import com.example.datn.dto.request.ThongTinNhanVienRequest;
import com.example.datn.dto.request.auth.SigninRequest;
import com.example.datn.dto.response.auth.TokenResponse;
import com.example.datn.exception.AuthenticationCustomException;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.model.TaiKhoan;
import com.example.datn.model.ThongTinNhanVien;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.ThongTinNhanVienRepository;
import com.example.datn.service.AuthService;
import com.example.datn.service.JwtService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceIMPL implements AuthService {

    private final ThongTinNhanVienRepository thongTinNhanVienRepository;

    private final TaiKhoanRepository taiKhoanRepository;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

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

    @Override
    public TokenResponse authenticate(SigninRequest signinRequest) {
        var user = this.taiKhoanRepository.findByUsername(signinRequest.getUsername());
        if(user == null) {
            throw new AuthenticationCustomException("Tài khoản không tồn tại");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getUsername(), signinRequest.getPassword(), user.getAuthorities()));
        String accessToken = this.jwtService.generateAccessToken(user.getId(), user.getUsername(), user.getAuthorities());
        String refreshToken = this.jwtService.generateRefreshToken(user.getId(), user.getUsername(), user.getAuthorities());
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .role(user.getAuthorities())
                .build();
    }

    @Override
    public TokenResponse refresh(HttpServletRequest request) {
        String refresh_token = request.getHeader("AUTHORIZATION_REFRESH_TOKEN");
        if (StringUtils.isBlank(refresh_token)) {
            throw new InvalidDataException("Token must be not blank!");
        }
        String username = this.jwtService.extractUsername(refresh_token, TokenType.REFRESH_TOKEN);
        var user = this.taiKhoanRepository.findByUsername(username);
        String accessToken = this.jwtService.generateAccessToken(user.getId(), user.getUsername(), user.getAuthorities());
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refresh_token)
                .username(user.getUsername())
                .role(user.getAuthorities())
                .build();
    }
}
