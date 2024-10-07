package com.example.datn.service;

import com.example.datn.model.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NhanVienService {
    Page<NhanVien> getAll(Pageable pageable);
    public NhanVien create(NhanVien nhanVien);
    public NhanVien update(NhanVien nhanVien);
    public void deleteNhanVien(Integer id);

    List<NhanVien> searchNhanVien(String keyword);
}
