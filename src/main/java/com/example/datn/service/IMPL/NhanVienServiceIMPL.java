package com.example.datn.service.IMPL;

import com.example.datn.dto.request.employee.EmployeeFilterRequest;
import com.example.datn.dto.request.employee.EmployeeRequests;
import com.example.datn.dto.response.employee.EmployeeResponses;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.exception.InvalidDataException;
import com.example.datn.model.KhachHang;
import com.example.datn.model.NhanVien;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.repository.customizeQuery.EmployeeRepository;
import com.example.datn.service.NhanVienService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
@Service
public class NhanVienServiceIMPL implements NhanVienService{
    PasswordEncoder passwordEncoder;
    EmployeeRepository employeeRepository;
    NhanVienRepository nhanVienRepository;
    TaiKhoanRepository taiKhoanRepository;
    VaiTroRepository vaiTroRepository;

    @Override
    public EmployeeResponses.EmployeeTemplate getEmployees(EmployeeFilterRequest request) {
        return employeeRepository.getAllEmployees(request);
    }

    @Override
    public void updateStatus(int id, boolean status) {

    }

    @Override
    public int storeEmployee(EmployeeRequests.EmployeeStore request) {
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

        NhanVien nhanVien = NhanVien.builder()
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
        return this.nhanVienRepository.save(nhanVien).getId();
    }

    @Override
    public EmployeeResponses.EmployeeResponseBase getEmployee(Integer id) {
        return null;
    }

    @Override
    public void updateEmployee(EmployeeRequests.EmployeeUpdate request, int id) {

    }
}
