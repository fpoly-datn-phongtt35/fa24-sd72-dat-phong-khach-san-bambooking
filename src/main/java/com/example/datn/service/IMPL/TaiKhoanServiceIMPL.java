package com.example.datn.service.IMPL;

import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

=======
import org.springframework.stereotype.Service;

import java.util.List;

>>>>>>> long
@Service
public class TaiKhoanServiceIMPL implements TaiKhoanService {
    @Autowired
    TaiKhoanRepository taiKhoanRepository;

    @Override
<<<<<<< HEAD
    public Page<TaiKhoan> findAll(Pageable pageable) {
        return taiKhoanRepository.findAll(pageable);
=======
    public List<TaiKhoan> findAll() {
        return taiKhoanRepository.findAll();
>>>>>>> long
    }

    @Override
    public void addTaiKhoan(TaiKhoan taiKhoan) {
        taiKhoanRepository.save(taiKhoan);
    }

    @Override
    public TaiKhoan detailTaiKhoan(Integer id) {
        return taiKhoanRepository.findById(id).get();
    }

    @Override
    public void updateTaiKhoan(TaiKhoan taiKhoan) {
        taiKhoanRepository.save(taiKhoan);
    }

    @Override
    public void updateStatusTaiKhoan(Integer id) {
        TaiKhoan taiKhoan = taiKhoanRepository.findById(id).orElse(null);
        if (taiKhoan != null) {
            if (taiKhoan.getTrangThai().equals("Hoạt động")) {
                taiKhoan.setTrangThai("Ngừng hoạt động");
            } else {
                taiKhoan.setTrangThai("Hoạt động");
            }
            taiKhoanRepository.save(taiKhoan);
        }
    }
}
