package com.example.datn.service;

import com.example.datn.model.TaiKhoan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaiKhoanService {
    Page<TaiKhoan> findAll(Pageable pageable);
    void addTaiKhoan(TaiKhoan taiKhoan);
    TaiKhoan detailTaiKhoan(Integer id);
    void updateTaiKhoan(TaiKhoan taiKhoan);
    void updateStatusTaiKhoan(Integer id);
}
