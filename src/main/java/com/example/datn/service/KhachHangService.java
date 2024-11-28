package com.example.datn.service;

import com.example.datn.dto.request.KhachHangDatPhongRequest;
import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.response.KhachHangResponse;
import com.example.datn.model.KhachHang;
import com.example.datn.model.KhachHangRegister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface KhachHangService {
    Page<KhachHang> getAllKhachHang(Pageable pageable);
    KhachHang createKhachHang(KhachHangRequest request);
    KhachHang createKhachHangRegister(KhachHangRegister request);
    KhachHangResponse getOneKhachHang(Integer id);
    KhachHangResponse updateKhachHang(Integer id, KhachHangRequest request);
    void deleteKhachHang(Integer id);
    Page<KhachHang> searchKhachHang(String keyword, Pageable pageable);
    void sendPasswordEmail(String email, String generatedPassword);
    String generatePassword();
    boolean checkLogin(String email, String matKhau);

    KhachHang createKhachHangDatPhong(KhachHangDatPhongRequest request);

    Optional<KhachHang> KhachHangLogin (String email);

}
