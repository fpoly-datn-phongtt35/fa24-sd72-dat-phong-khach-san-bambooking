package com.example.datn.service;

import com.example.datn.dto.request.PhieuDichVuRequest;
import com.example.datn.model.PhieuDichVu;
import org.springframework.stereotype.Service;

import java.util.List;

public interface PhieuDichVuService {
    List<PhieuDichVu> getAll();
    PhieuDichVu addPhieuDichVu(PhieuDichVuRequest phieuDichVuRequest);
    PhieuDichVu detailPhieuDichVu(Integer id);
    PhieuDichVu updatePhieuDichVu(PhieuDichVuRequest phieuDichVuRequest);
    void deletePhieuDichVu(Integer id);
    void updateStatus(Integer id);
}
