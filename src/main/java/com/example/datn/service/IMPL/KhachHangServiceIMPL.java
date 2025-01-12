package com.example.datn.service.IMPL;

import com.example.datn.config.PasswordGenerator;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.request.customer.CustomerRequest;
import com.example.datn.dto.request.customer.FilterRequest;
import com.example.datn.dto.response.KhachHangResponse;
import com.example.datn.dto.response.customer.BaseCustomerResponse;
import com.example.datn.dto.response.customer.CustomerResponse;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.mapper.KhachHangMapper;
import com.example.datn.model.KhachHang;
import com.example.datn.model.KhachHangRegister;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.service.KhachHangService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class KhachHangServiceIMPL implements KhachHangService {

    KhachHangRepository khachHangRepository;

    KhachHangMapper khachHangMapper;

    TaiKhoanRepository taiKhoanRepository;

    VaiTroRepository vaiTroRepository;

    PasswordEncoder passwordEncoder;

    JavaMailSender mailSender;

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
    public KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request) {
        KhachHang khachHang = new KhachHang();
        khachHang.setTen(request.getTen());
        khachHang.setHo(request.getHo());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(false);
        return khachHangRepository.save(khachHang);
    }

    @Override
    public BaseCustomerResponse getCustomers(FilterRequest request) {
        Page<KhachHang> pageable = this.khachHangRepository.findAll(PageRequest.of(request.getPageNo(), request.getPageSize()));
        List<CustomerResponse> data  = pageable.getContent().stream().map(s ->
            CustomerResponse.builder()
                    .id(s.getId())
                    .fullName(String.format("%s %s", s.getHo(), s.getTen()))
                    .username(s.getTaiKhoan().getUsername())
                    .gender(s.getGioiTinh())
                    .phoneNumber(s.getSdt())
                    .isLocked(s.getTaiKhoan().getTrangThai())
                    .build()
        ).toList();

        return BaseCustomerResponse.builder()
                .totalPage(pageable.getTotalPages())
                .pageNo(request.getPageNo())
                .pageSize(request.getPageSize())
                .data(data)
                .build();
    }

    @Override
    public void updateStatus(int id, boolean status) {
        KhachHang khachHang = this.khachHangRepository.findById(id).orElseThrow(() -> new EntityNotFountException("Customer not found!"));
        TaiKhoan taiKhoan = khachHang.getTaiKhoan();
        taiKhoan.setTrangThai(status);
        taiKhoanRepository.save(taiKhoan);
        log.info("Update status successfully");
    }

    @Override
    public int storeCustomer(CustomerRequest request) {
        if(this.taiKhoanRepository.findByTenDangNhap(request.getUsername()).isPresent()){
            throw new InvalidDataException("Tài khoản đã tồn tại!");
        }
        TaiKhoan taiKhoan = TaiKhoan.builder()
                .tenDangNhap(request.getUsername())
                .matKhau(passwordEncoder.encode(request.getPassword()))
                .idVaiTro(this.vaiTroRepository.findById(2).orElseThrow(() -> new EntityNotFountException("Role not found!")))
                .trangThai(true)
                .build();
        KhachHang khachHang =KhachHang.builder()
                .taiKhoan(this.taiKhoanRepository.save(taiKhoan))
                .cmnd(request.getIdCard())
                .ho(request.getLastName())
                .ten(request.getFirstName())
                .gioiTinh(request.getGender())
                .diaChi(request.getAddress())
                .email(request.getEmail())
                .sdt(request.getPhoneNumber())
                .ngaySua(LocalDateTime.now())
                .ngayTao(LocalDateTime.now())
                .build();
        return this.khachHangRepository.save(khachHang).getId();
    }
}
