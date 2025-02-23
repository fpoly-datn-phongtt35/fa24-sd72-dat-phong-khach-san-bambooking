package com.example.datn.service.IMPL;

import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.customer.CustomerRequests;
import com.example.datn.dto.request.customer.FilterRequest;
import com.example.datn.dto.response.customer.CustomerResponses;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.model.KhachHang;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.repository.customizeQuery.CustomerRepository;
import com.example.datn.service.KhachHangService;
import com.example.datn.utilities.CloudinaryUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

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

    private final CloudinaryUtils cloudinary;

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
    @Transactional(rollbackFor = Exception.class)
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
                .trangThai(true)
                .build();

        if (request.getAvatar() != null) {
            Map<String, String> upload = this.cloudinary.upload(request.getAvatar());
            khachHang.setAvatar(upload.get("url"));
            khachHang.setPublic_id(upload.get("publicId"));
        }
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

        if (request.getAvatar() != null) {
            if (customer.getPublic_id() != null) {
                this.cloudinary.removeByPublicId(customer.getPublic_id());
            }
            Map<String, String> upload = this.cloudinary.upload(request.getAvatar());
            customer.setAvatar(upload.get("url"));
            customer.setPublic_id(upload.get("publicId"));
        }
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
                .avatar(khachHang.getAvatar())
                .build();
    }
}
