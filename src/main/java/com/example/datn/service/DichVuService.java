package com.example.datn.service;

import com.example.datn.model.DichVu;

import java.util.List;

public interface DichVuService {
    List<DichVu> getAll();
    void addDichVu(DichVu dv);
    DichVu detailDichVu(Integer id);
    void updateStatus(Integer id);
    void updateDichVu(DichVu dv);

    List<DichVu> findByAll(String key);
}
