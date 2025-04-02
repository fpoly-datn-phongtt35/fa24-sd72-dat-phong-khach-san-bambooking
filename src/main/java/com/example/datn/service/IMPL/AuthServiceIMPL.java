package com.example.datn.service.IMPL;

import com.example.datn.common.TokenType;
import com.example.datn.config.PasswordGenerator;
import com.example.datn.controller.AuthController;
import com.example.datn.dto.request.ThongTinNhanVienRequest;
import com.example.datn.dto.request.auth.SigninRequest;
import com.example.datn.dto.response.auth.TokenResponse;
import com.example.datn.exception.AuthenticationCustomException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.model.KhachHang;
import com.example.datn.model.TaiKhoan;
import com.example.datn.model.ThongTinNhanVien;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.ThongTinNhanVienRepository;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.service.AuthService;
import com.example.datn.service.JwtService;
import com.example.datn.utilities.CommonUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceIMPL implements AuthService {

    private final ThongTinNhanVienRepository thongTinNhanVienRepository;

    private final TaiKhoanRepository taiKhoanRepository;

    private final KhachHangRepository khachHangRepository;

    private final VaiTroRepository vaiTroRepository;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String username;

    @Override
    public TaiKhoan login(String tenDangNhap, String matKhau) {
        Optional<TaiKhoan> taiKhoanOptional = taiKhoanRepository.findByTenDangNhap(tenDangNhap);
        if (taiKhoanOptional.isPresent()) {
            TaiKhoan taiKhoan = taiKhoanOptional.get();
            if (taiKhoan.getMatKhau().equals(matKhau)) {
                return taiKhoan;
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

    @Override
    public String signUp(String email) {
        Optional<TaiKhoan> ifExists = this.taiKhoanRepository.findByTenDangNhap(email);
        if(ifExists.isPresent()) {
            throw new InvalidDataException("Tài khoản đã tồn tại!");
        }
        String verificationCode = CommonUtils.generateCode();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(username);
        message.setTo(email);
        message.setSubject("Mã Xác Nhận Của Bạn");
        message.setText("Chào bạn,\n\n" +
                "Mã xác nhận của bạn là: " + verificationCode + "\n" +
                "Vui lòng sử dụng mã này để hoàn tất quá trình xác nhận.\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ hỗ trợ");

        try {
            mailSender.send(message);
            return passwordEncoder.encode(verificationCode);
        } catch (Exception e) {
            throw new InvalidDataException("Không thể gửi email: " + e.getMessage());
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public boolean verifyCode(AuthController.VerifyCodeRequest request) {
        boolean result = passwordEncoder.matches(request.getCode(), request.getEncodedCode());
        if (result) {
            String password = PasswordGenerator.generateRandomPassword();
            TaiKhoan tk = TaiKhoan.builder()
                    .tenDangNhap(request.getEmail())
                    .matKhau(this.passwordEncoder.encode(password))
                    .trangThai(true)
                    .idVaiTro(this.vaiTroRepository.findById(2).orElse(null))
                    .build();
            tk = this.taiKhoanRepository.save(tk);

            KhachHang kh = KhachHang.builder()
                    .taiKhoan(tk)
                    .email(request.getEmail())
                    .ngaySua(LocalDateTime.now())
                    .ngayTao(LocalDateTime.now())
                    .trangThai(true)
                    .build();
            this.khachHangRepository.save(kh);

            try {
                sendTempPasswordEmail(request.getEmail(), password);
                log.info("Temporary password sent to email: {}", request.getEmail());
            } catch (Exception e) {
                log.error("Failed to send email: {}", e.getMessage());
            }
        }
        return result;
    }

    private void sendTempPasswordEmail(String toEmail, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(username);
        message.setTo(toEmail);
        message.setSubject("Mật Khẩu Tạm Thời Của Bạn");
        message.setText("Chào bạn,\n\n" +
                "Tài khoản của bạn đã được tạo thành công.\n" +
                "Mật khẩu tạm thời của bạn là: " + password + "\n" +
                "Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.\n\n" +
                "Trân trọng,\n" +
                "Đội ngũ hỗ trợ");

        mailSender.send(message);
    }
}
