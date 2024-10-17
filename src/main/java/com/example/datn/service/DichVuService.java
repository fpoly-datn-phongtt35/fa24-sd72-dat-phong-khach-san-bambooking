package com.example.datn.service;

import com.example.datn.model.DichVu;

import java.util.List;

public interface DichVuService {
    List<DichVu> getAll();
    DichVu addDichVu(DichVu dv);
    DichVu detailDichVu(Integer id);
    void updateStatus(Integer id);
    DichVu updateDichVu(DichVu dv);
    void deleteDichVu(Integer id);
    DichVu findById(Integer id);
    List<DichVu> findByAll(String key);
}

