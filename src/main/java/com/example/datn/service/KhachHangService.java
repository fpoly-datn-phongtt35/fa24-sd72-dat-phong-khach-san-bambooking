package com.example.datn.service;

import com.example.datn.dto.request.KhachHangRequest;
import com.example.datn.dto.response.KhachHangResponse;
import com.example.datn.model.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface KhachHangService {
    Page<KhachHang> getAllKhachHang(Pageable pageable);
    KhachHang createKhachHang(KhachHangRequest request);
    KhachHangResponse getOneKhachHang(Integer id);
    KhachHangResponse updateKhachHang(Integer id, KhachHangRequest request);
    void deleteKhachHang(Integer id);
    Page<KhachHang> searchKhachHang(String keyword, Pageable pageable);
    KhachHang findByEmail(String email);
    void sendPasswordEmail(String email, String generatedPassword);
    String generatePassword();

}
