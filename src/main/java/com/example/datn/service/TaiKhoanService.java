package com.example.datn.service;

import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaiKhoanService {
    Page<TaiKhoan> getAllTaiKhoan(Pageable pageable);
    public TaiKhoan create(TaiKhoan taiKhoan);
    public TaiKhoan update(TaiKhoan taiKhoan);
    public void deleteTaiKhoan(Integer id);
}
