package com.example.datn.service;

import com.example.datn.dto.request.DichVuSuDungRequest;
import com.example.datn.model.DichVuSuDung;

import java.util.List;

public interface DichVuSuDungService {
    List<DichVuSuDung> getAll();
    DichVuSuDung addPhieuDichVu(DichVuSuDungRequest dichVuSuDungRequest);
    DichVuSuDung detailPhieuDichVu(Integer id);
    DichVuSuDung updatePhieuDichVu(DichVuSuDungRequest dichVuSuDungRequest);
    void deletePhieuDichVu(Integer id);
    void updateStatus(Integer id);
}
