package com.example.datn.service.IMPL;

import com.example.datn.dto.request.PhieuDichVuRequest;
import com.example.datn.model.DichVuDiKem;
import com.example.datn.model.PhieuDichVu;
import com.example.datn.repository.PhieuDichVuRepository;
import com.example.datn.service.PhieuDichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service

public class PhieuDichVuServiceIMPL implements PhieuDichVuService {
    @Autowired
    PhieuDichVuRepository phieuDichVuRepository;
    @Override
    public List<PhieuDichVu> getAll() {
        return phieuDichVuRepository.findAll();
    }

    @Override
    public PhieuDichVu addPhieuDichVu(PhieuDichVuRequest phieuDichVuRequest) {
        PhieuDichVu phieuDichVu = new PhieuDichVu();
        phieuDichVu.setDichVu(phieuDichVuRequest.getDichVu());
        phieuDichVu.setThongTinDatPhong(phieuDichVuRequest.getThongTinDatPhong());
        phieuDichVu.setSoLuongSuDung(phieuDichVuRequest.getSoLuongSuDung());
        // Ngày bắt đầu và kết thúc tự động
        phieuDichVu.setNgayBatDau(LocalDateTime.now());
        phieuDichVu.setNgayKetThuc(LocalDateTime.now().plusDays(1)); // Ví dụ cộng 1 ngày
        phieuDichVu.setGiaSuDung(phieuDichVuRequest.getGiaSuDung());
        phieuDichVu.setThanhTien(phieuDichVuRequest.getThanhTien());
        phieuDichVu.setTrangThai(phieuDichVuRequest.getTrangThai());
        return phieuDichVuRepository.save(phieuDichVu);
    }


    @Override
    public PhieuDichVu detailPhieuDichVu(Integer id) {
        return phieuDichVuRepository.findById(id).get();
    }

    @Override
    public PhieuDichVu updatePhieuDichVu(PhieuDichVuRequest phieuDichVuRequest) {
        // Tìm dịch vụ đi kèm bằng ID
        PhieuDichVu phieuDichVu = phieuDichVuRepository.findById(phieuDichVuRequest.getId()).orElse(null);

        if (phieuDichVu != null) {
            phieuDichVu.setDichVu(phieuDichVuRequest.getDichVu());
            phieuDichVu.setThongTinDatPhong(phieuDichVuRequest.getThongTinDatPhong());
            phieuDichVu.setSoLuongSuDung(phieuDichVuRequest.getSoLuongSuDung());
            // Thiết lập ngày kết thúc từ yêu cầu
            phieuDichVu.setNgayKetThuc(phieuDichVuRequest.getNgayKetThuc());
            phieuDichVu.setGiaSuDung(phieuDichVuRequest.getGiaSuDung());
            phieuDichVu.setThanhTien(phieuDichVuRequest.getThanhTien());
            phieuDichVu.setTrangThai(phieuDichVuRequest.getTrangThai());

            return phieuDichVuRepository.save(phieuDichVu);
        }

        return null;
    }


    @Override
    public void deletePhieuDichVu(Integer id) {
        phieuDichVuRepository.deleteById(id);
    }

    @Override
    public void updateStatus(Integer id) {
        PhieuDichVu phieuDichVu = phieuDichVuRepository.findById(id).orElse(null);
        if (phieuDichVu != null) {
            if (phieuDichVu.getTrangThai().equals("Hoạt động")) {
                phieuDichVu.setTrangThai("Ngừng hoạt động");
            } else {
                phieuDichVu.setTrangThai("Hoạt động");
            }
            phieuDichVuRepository.save(phieuDichVu);
        }
    }
}
