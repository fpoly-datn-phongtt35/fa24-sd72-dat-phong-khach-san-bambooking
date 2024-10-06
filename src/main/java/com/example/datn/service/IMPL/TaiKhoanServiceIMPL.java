package com.example.datn.service.IMPL;

import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TaiKhoanServiceIMPL implements TaiKhoanService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;
    @Override
    public Page<TaiKhoan> getAllTaiKhoan(Pageable pageable) {
        return taiKhoanRepository.findAll(pageable);
    }

}
