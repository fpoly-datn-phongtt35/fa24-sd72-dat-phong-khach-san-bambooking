package com.example.datn.service.IMPL;

import com.example.datn.model.NhanVien;
import com.example.datn.model.TaiKhoan;
import com.example.datn.repository.TaiKhoanRepository;
import com.example.datn.service.TaiKhoanService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
public class TaiKhoanServiceIMPL implements TaiKhoanService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;
    @Override
    public Page<TaiKhoan> getAllTaiKhoan(Pageable pageable) {
        return taiKhoanRepository.findAll(pageable);
    }

    @Override
    public TaiKhoan create(TaiKhoan taiKhoan) {
        return taiKhoanRepository.save(taiKhoan);
    }

    @Override
    public TaiKhoan update(TaiKhoan taiKhoan) {
        if (taiKhoanRepository.existsById(taiKhoan.getId())) {
            return taiKhoanRepository.save(taiKhoan); // Cập nhật thông tin nhân viên
        } else {
            throw new EntityNotFoundException("Tài khoản không tồn tại với ID: " + taiKhoan.getId());
        }
    }

    @Override
    public void deleteTaiKhoan(Integer id) {
        Optional<TaiKhoan> taiKhoanOptional = taiKhoanRepository.findById(id);
        if(taiKhoanOptional.isPresent()){
            taiKhoanRepository.delete(taiKhoanOptional.get());
        }else {
            System.out.println("Tài khoản không tồn tại với ID: " + id);
        }
    }

    @Override
    public Page<TaiKhoan> searchTaiKhoan(String keyword, Pageable pageable) {
        return taiKhoanRepository.searchByName(keyword, pageable);
    }

    @Override
    public Optional<TaiKhoan> findByTenDangNhap(String tenDangNhap) {
        return taiKhoanRepository.findByTenDangNhap(tenDangNhap);
    }



}
