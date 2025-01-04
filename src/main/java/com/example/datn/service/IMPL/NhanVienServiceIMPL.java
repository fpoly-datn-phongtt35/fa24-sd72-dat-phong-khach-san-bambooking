package com.example.datn.service.IMPL;

import com.example.datn.config.PasswordGenerator;
import com.example.datn.dto.request.NhanVienRequest;
import com.example.datn.model.NhanVien;
import com.example.datn.model.TaiKhoan;
import com.example.datn.model.VaiTro;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.repository.VaiTroRepository;
import com.example.datn.service.NhanVienService;
import com.example.datn.service.PhongService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class NhanVienServiceIMPL implements NhanVienService{
    @Autowired
    NhanVienRepository nhanVienRepository;
    @Autowired
    TaiKhoanRepository taiKhoanRepository;

    @Autowired
    VaiTroRepository vaiTroRepository;


    @Override
    public Page<NhanVien> getAll(Pageable pageable) {
        return nhanVienRepository.findAll(pageable);
    }

    @Override
    public NhanVien create(NhanVien nhanVien) {
        return  nhanVienRepository.save(nhanVien);
    }

    @Override
    public NhanVien update(NhanVien nhanVien) {
        if (nhanVienRepository.existsById(nhanVien.getId())) {
            return nhanVienRepository.save(nhanVien); // Cập nhật thông tin nhân viên
        } else {
            throw new EntityNotFoundException("Nhân viên không tồn tại với ID: " + nhanVien.getId());
        }
    }

    @Override
    public void deleteNhanVien(Integer id) {
        Optional<NhanVien> optionalNhanVien = nhanVienRepository.findById(id);

        if (optionalNhanVien.isPresent()) {
            nhanVienRepository.delete(optionalNhanVien.get());
        } else {
            // Nếu bạn không muốn tạo ra ngoại lệ, có thể ghi log hoặc thực hiện một hành động khác
            System.out.println("Nhân viên không tồn tại với ID: " + id);
        }
    }

    @Override
    public Page<NhanVien> searchNhanVien(String keyword, Pageable pageable) {
        return nhanVienRepository.searchByName(keyword,pageable);
    }

    @Override
    public Optional<NhanVien> findBySdt(String sdt) {
        return nhanVienRepository.findBySdt(sdt);
    }

    @Override
    public NhanVien getNhanVienById(Integer id) {
        return nhanVienRepository.findById(id).orElse(null);
    }

    @Override
    public NhanVien createNhanVien(NhanVienRequest request) {
        // Tạo tài khoản mới
        TaiKhoan taiKhoan = new TaiKhoan();
        taiKhoan.setTenDangNhap(request.getEmail());
        String generatedPassword = PasswordGenerator.generateRandomPassword();
        taiKhoan.setMatKhau(generatedPassword);
        taiKhoan.setTrangThai(true);

        TaiKhoan saveTaiKhoan = taiKhoanRepository.save(taiKhoan);

        // Lấy vai trò dựa trên ID từ request
        Integer vaiTroId = request.getVaiTro().getId();
        VaiTro vaiTro = vaiTroRepository.findById(vaiTroId)
                .orElseThrow(() -> new IllegalArgumentException("Vai trò không tồn tại"));

        // Tạo và lưu nhân viên
        NhanVien nhanVien = new NhanVien();
        nhanVien.setTaiKhoan(saveTaiKhoan);
        nhanVien.setHo(request.getHo());
        nhanVien.setTen(request.getTen());
        nhanVien.setGioiTinh(request.getGioiTinh());
        nhanVien.setDiaChi(request.getDiaChi());
        nhanVien.setSdt(request.getSdt());
        nhanVien.setEmail(request.getEmail());
        nhanVien.setNgayTao(LocalDate.now());
        nhanVien.setNgaySua(LocalDate.now());
        nhanVien.setTrangThai(request.isTrangThai());

        return nhanVienRepository.save(nhanVien);
    }


}
