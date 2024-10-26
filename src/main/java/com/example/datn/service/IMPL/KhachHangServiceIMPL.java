package com.example.datn.service.IMPL;

import com.example.datn.config.PasswordGenerator;
import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.response.KhachHangResponse;
import com.example.datn.mapper.KhachHangMapper;
import com.example.datn.model.KhachHang;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.KhachHangService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class KhachHangServiceIMPL implements KhachHangService {
    KhachHangRepository khachHangRepository;
    TaiKhoanRepository taiKhoanRepository;
    KhachHangMapper khachHangMapper;

    @Override
    public Page<KhachHang> getAllKhachHang(Pageable pageable) {
        return khachHangRepository.findAll(pageable);
    }

    @Override
    public KhachHang createKhachHang(KhachHangRequest request) {
        KhachHang khachHang = khachHangMapper.toKhachHang(request);
        khachHang.setTen(request.getTen());
        khachHang.setHo(request.getHo());
        khachHang.setSdt(request.getSdt());
        khachHang.setEmail(request.getEmail());
        khachHang.setNgayTao(LocalDateTime.now());
        khachHang.setNgaySua(LocalDateTime.now());
        khachHang.setTrangThai(true);
        return khachHangRepository.save(khachHang);
    }

    @Override
    public KhachHangResponse getOneKhachHang(Integer id) {
        KhachHang khachHang = khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID khach hang not found: " + id));

        return khachHangMapper.toKhachHangResponse(khachHang);
    }

    @Override
    public KhachHangResponse updateKhachHang(Integer id, KhachHangRequest request) {
//        KhachHang khachHang = khachHangRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("ID khach hang not found: " + id));
//        khachHang.setHo(request.getHo());
//        khachHang.setTen(request.getTen());
//        khachHang.setGioiTinh(request.getGioiTinh());
//        khachHang.setDiaChi(request.getDiaChi());
//        khachHang.setSdt(request.getSdt());
//        khachHang.setEmail(request.getEmail());
//        khachHang.setTrangThai(request.getTrangThai());
//        khachHang.setNgaySua(LocalDateTime.now());
//
//        KhachHang updateKH = khachHangRepository.save(khachHang);
//
//        TaiKhoan taiKhoan = updateKH.getTaiKhoan();
//        if (taiKhoan != null) {
//            taiKhoan.setTenDangNhap(request.getEmail());
//            taiKhoanRepository.save(taiKhoan);
//        }
//        return khachHangMapper.toKhachHangResponse(updateKH);
        return null;
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
}
