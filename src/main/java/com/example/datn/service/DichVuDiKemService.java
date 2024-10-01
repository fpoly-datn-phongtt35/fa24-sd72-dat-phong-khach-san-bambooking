package com.example.datn.service;

import com.example.datn.model.DichVuDiKem;

import java.util.List;

public interface DichVuDiKemService {
    List<DichVuDiKem> getAll();
    void addDichVuDiKem(DichVuDiKem dvdk);
    DichVuDiKem detailDichVuDiKem(Integer id);
    void updateStatus(Integer id);
    void updateDichVuDiKem(DichVuDiKem dvdk);
    List<DichVuDiKem> findByAll(String key);
}
