package com.example.datn.service;

import com.example.datn.dto.request.PhieuDichVuRequest;
import com.example.datn.model.DichVuSuDung;

import java.util.List;

public interface PhieuDichVuService {
    List<DichVuSuDung> getAll();
    DichVuSuDung addPhieuDichVu(PhieuDichVuRequest phieuDichVuRequest);
    DichVuSuDung detailPhieuDichVu(Integer id);
    DichVuSuDung updatePhieuDichVu(PhieuDichVuRequest phieuDichVuRequest);
    void deletePhieuDichVu(Integer id);
    void updateStatus(Integer id);
}
