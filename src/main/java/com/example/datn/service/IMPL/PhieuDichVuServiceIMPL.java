package com.example.datn.service.IMPL;

import com.example.datn.dto.request.PhieuDichVuRequest;
import com.example.datn.model.DichVuSuDung;
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
    public List<DichVuSuDung> getAll() {
        return phieuDichVuRepository.findAll();
    }

    @Override
    public DichVuSuDung addPhieuDichVu(PhieuDichVuRequest phieuDichVuRequest) {
        DichVuSuDung dichVuSuDung = new DichVuSuDung();
        dichVuSuDung.setDichVu(phieuDichVuRequest.getDichVu());
        dichVuSuDung.setThongTinDatPhong(phieuDichVuRequest.getThongTinDatPhong());
        dichVuSuDung.setSoLuongSuDung(phieuDichVuRequest.getSoLuongSuDung());
        // Ngày bắt đầu và kết thúc tự động
        dichVuSuDung.setNgayBatDau(LocalDateTime.now());
        dichVuSuDung.setNgayKetThuc(LocalDateTime.now().plusDays(1)); // Ví dụ cộng 1 ngày
        dichVuSuDung.setGiaSuDung(phieuDichVuRequest.getGiaSuDung());
        dichVuSuDung.setThanhTien(phieuDichVuRequest.getThanhTien());
        dichVuSuDung.setTrangThai(phieuDichVuRequest.getTrangThai());
        return phieuDichVuRepository.save(dichVuSuDung);
    }


    @Override
    public DichVuSuDung detailPhieuDichVu(Integer id) {
        return phieuDichVuRepository.findById(id).get();
    }

    @Override
    public DichVuSuDung updatePhieuDichVu(PhieuDichVuRequest phieuDichVuRequest) {
        // Tìm dịch vụ đi kèm bằng ID
        DichVuSuDung dichVuSuDung = phieuDichVuRepository.findById(phieuDichVuRequest.getId()).orElse(null);

        if (dichVuSuDung != null) {
            dichVuSuDung.setDichVu(phieuDichVuRequest.getDichVu());
            dichVuSuDung.setThongTinDatPhong(phieuDichVuRequest.getThongTinDatPhong());
            dichVuSuDung.setSoLuongSuDung(phieuDichVuRequest.getSoLuongSuDung());
            // Thiết lập ngày kết thúc từ yêu cầu
            dichVuSuDung.setNgayKetThuc(phieuDichVuRequest.getNgayKetThuc());
            dichVuSuDung.setGiaSuDung(phieuDichVuRequest.getGiaSuDung());
            dichVuSuDung.setThanhTien(phieuDichVuRequest.getThanhTien());
            dichVuSuDung.setTrangThai(phieuDichVuRequest.getTrangThai());

            return phieuDichVuRepository.save(dichVuSuDung);
        }

        return null;
    }


    @Override
    public void deletePhieuDichVu(Integer id) {
        phieuDichVuRepository.deleteById(id);
    }

    @Override
    public void updateStatus(Integer id) {
        DichVuSuDung dichVuSuDung = phieuDichVuRepository.findById(id).orElse(null);
        if (dichVuSuDung != null) {
            if (dichVuSuDung.getTrangThai().equals("Hoạt động")) {
                dichVuSuDung.setTrangThai("Ngừng hoạt động");
            } else {
                dichVuSuDung.setTrangThai("Hoạt động");
            }
            phieuDichVuRepository.save(dichVuSuDung);
        }
    }
}
