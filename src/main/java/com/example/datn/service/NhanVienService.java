package com.example.datn.service;

import com.example.datn.model.NhanVien;

import java.util.List;

public interface NhanVienService {
    List<NhanVien> getAll();//goi tat ca
    NhanVien findById(Integer id);//goi 1 nhan vien
    void addNhanVien(NhanVien nhanVien);//Them nhan vien
    void updateNhanVien(NhanVien nhanVien);//cap nhat thong tin nhan vien
    void updateTrangThaiNhanVien(Integer id);//Cap nhat trang thai nhan vien ( Hoat dong , K hoat dong)
    List<NhanVien> search(String keyword);

}
