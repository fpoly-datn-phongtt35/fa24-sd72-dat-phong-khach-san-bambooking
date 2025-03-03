package com.example.datn.service.IMPL;

import com.example.datn.config.PasswordGenerator;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.request.customer.CustomerRequests;
import com.example.datn.dto.request.customer.FilterRequest;
import com.example.datn.dto.response.KhachHangResponse;
import com.example.datn.dto.response.customer.CustomerResponses;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.mapper.KhachHangMapper;
import com.example.datn.model.KhachHang;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.repository.customizeQuery.CustomerRepository;
import com.example.datn.service.KhachHangService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class KhachHangServiceIMPL implements KhachHangService {

    KhachHangRepository khachHangRepository;

    TaiKhoanRepository taiKhoanRepository;

    VaiTroRepository vaiTroRepository;

    PasswordEncoder passwordEncoder;

    CustomerRepository customerRepository;

    @Override
    public KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request) {
        KhachHang khachHang = new KhachHang();
        khachHang.setTen(request.getTen());
        khachHang.setHo(request.getHo());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
//        khachHang.setGioiTinh(request.getGioiTinh());
//        khachHang.setDiaChi(request.getDiaChi());
//        khachHang.setMatKhau(request.getMatKhau());
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(request.getTrangThai());
        return khachHangRepository.save(khachHang);
    }

    @Override
    public KhachHang updateKhachHangDatPhong(KhachHangDatPhongRequest request) {
        KhachHang khachHang = khachHangRepository.getReferenceById(request.getId());
        khachHang.setTen(request.getTen());
        khachHang.setHo(request.getHo());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
//        khachHang.setGioiTinh(request.getGioiTinh());
//        khachHang.setDiaChi(request.getDiaChi());
//        khachHang.setMatKhau(request.getMatKhau());
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(request.getTrangThai());
        return khachHangRepository.save(khachHang);
    }

    @Override
    public void deleteKhachHangDatPhong(Integer idkh) {
        khachHangRepository.deleteById(idkh);
    }

    @Override
    public CustomerResponses.CustomerTemplate getCustomers(FilterRequest request) {
        return this.customerRepository.getAllCustomers(request);
    }

    @Override
    public void updateStatus(int id, boolean status) {
        KhachHang khachHang = this.khachHangRepository.findById(id)
                .orElseThrow(() -> new EntityNotFountException("Customer not found!"));
        TaiKhoan taiKhoan = khachHang.getTaiKhoan();
        taiKhoan.setTrangThai(status);
        taiKhoanRepository.save(taiKhoan);
        log.info("Update status successfully");
    }

    @Override
    public int storeCustomer(CustomerRequests.CustomerStore request) {
        if (this.taiKhoanRepository.findByTenDangNhap(request.getUsername()).isPresent()) {
            throw new InvalidDataException("Tài khoản đã tồn tại!");
        }
        TaiKhoan taiKhoan = TaiKhoan.builder()
                .tenDangNhap(request.getUsername())
                .matKhau(passwordEncoder.encode(request.getPassword()))
                .idVaiTro(this.vaiTroRepository.findById(2)
                        .orElseThrow(() -> new EntityNotFountException("Role not found!")))
                .trangThai(true)
                .build();

        KhachHang khachHang = KhachHang.builder()
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

    @Override
    public CustomerResponses.CustomerResponseBase getCustomer(Integer id) {
        return getCustomerById(id);
    }

    @Override
    public void updateCustomer(CustomerRequests.CustomerUpdate request, int id) {
        KhachHang customer = this.khachHangRepository.findById(id)
                .orElseThrow(() -> new EntityNotFountException("Customer not found!"));
        customer.setHo(request.getLastName());
        customer.setTen(request.getFirstName());
        customer.setEmail(request.getEmail());
        customer.setGioiTinh(request.getGender());
        customer.setDiaChi(request.getAddress());
        customer.setSdt(request.getPhoneNumber());
        customer.setNgaySua(LocalDateTime.now());
        this.khachHangRepository.save(customer);
    }

    private CustomerResponses.CustomerResponseBase getCustomerById(Integer id) {
        KhachHang khachHang = this.khachHangRepository.findById(id)
                .orElseThrow(() -> new EntityNotFountException("Customer not found!"));
        return CustomerResponses.CustomerResponseBase.builder()
                .id(khachHang.getId())
                .username(khachHang.getTaiKhoan().getTenDangNhap())
                .firstName(khachHang.getTen())
                .lastName(khachHang.getHo())
                .idCard(khachHang.getCmnd())
                .email(khachHang.getEmail())
                .address(khachHang.getDiaChi())
                .phoneNumber(khachHang.getSdt())
                .gender(khachHang.getGioiTinh())
                .build();
    }
}
