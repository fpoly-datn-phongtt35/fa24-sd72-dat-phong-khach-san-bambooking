package com.example.datn.service;
import com.example.datn.model.TaiKhoan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface TaiKhoanService {

    Page<TaiKhoan> getAllTaiKhoan(Pageable pageable);
    public TaiKhoan create(TaiKhoan taiKhoan);
    public TaiKhoan update(TaiKhoan taiKhoan);
    public void deleteTaiKhoan(Integer id);
    Page<TaiKhoan> searchTaiKhoan(String keyword, Pageable pageable);
    Optional<TaiKhoan> findByTenDangNhap(String tenDangNhap);

}
