package com.example.datn.service.IMPL;

import com.example.datn.model.KhachHang;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KhachHangServiceIMPL implements KhachHangService {
    @Autowired
    KhachHangRepository khachHangRepository;

    @Override
    public List<KhachHang> getAll() {
        return khachHangRepository.findAll();
    }

    @Override
    public KhachHang findById(Integer id) {
        return khachHangRepository.findById(id).get();
    }

    @Override
    public void addKhachHang(KhachHang khachHang) {
        khachHangRepository.save(khachHang);
    }

    @Override
    public void updateKhachHang(KhachHang khachHang) {
        khachHangRepository.save(khachHang);
    }

    @Override
    public void updateTrangThaiKhachHang(Integer id) {
        KhachHang khachHang = khachHangRepository.findById(id).orElse(null);
        if (khachHang != null) {
            if (khachHang.getTrangThai().equals("Hoạt động")) {
                khachHang.setTrangThai("Ngừng hoạt động");
            } else {
                khachHang.setTrangThai("Hoạt động");
            }
            khachHangRepository.save(khachHang);
        }
    }

    @Override
    public List<KhachHang> search(String keyword) {
        return khachHangRepository.search(keyword);
    }
}
