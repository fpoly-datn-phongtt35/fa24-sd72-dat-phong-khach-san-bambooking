package com.example.datn.service;

import com.example.datn.model.PhieuDichVu;
import org.springframework.stereotype.Service;

import java.util.List;

public interface PhieuDichVuService {
    List<PhieuDichVu> findAll();
    void addPhieuDichVu(PhieuDichVu phieuDichVu);
    PhieuDichVu detailPhieuDichVu(Integer id);
    void updatePhieuDichVu(PhieuDichVu phieuDichVu);
    void deletePhieuDichVu(Integer id);
}
