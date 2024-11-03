package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DichVuSuDungRequest;
import com.example.datn.model.DichVuSuDung;
import com.example.datn.repository.DichVuSuDungRepository;
import com.example.datn.service.DichVuSuDungService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service

public class DichVuSuDungServiceIMPL implements DichVuSuDungService {
    @Autowired
    DichVuSuDungRepository phieuDichVuRepository;
    @Override
    public List<DichVuSuDung> getAll() {
        return phieuDichVuRepository.findAll();
    }

    @Override
    public DichVuSuDung addPhieuDichVu(DichVuSuDungRequest dichVuSuDungRequest) {
        DichVuSuDung dichVuSuDung = new DichVuSuDung();
        dichVuSuDung.setDichVu(dichVuSuDungRequest.getDichVu());
        dichVuSuDung.setXepPhong(dichVuSuDungRequest.getXepPhong());
        dichVuSuDung.setSoLuongSuDung(dichVuSuDungRequest.getSoLuongSuDung());
        // Ngày bắt đầu và kết thúc tự động
        dichVuSuDung.setNgayBatDau(LocalDateTime.now());
        dichVuSuDung.setNgayKetThuc(LocalDateTime.now().plusDays(1)); // Ví dụ cộng 1 ngày
        dichVuSuDung.setGiaSuDung(dichVuSuDungRequest.getGiaSuDung());
        dichVuSuDung.setTrangThai(dichVuSuDungRequest.getTrangThai());
        return phieuDichVuRepository.save(dichVuSuDung);
    }


    @Override
    public DichVuSuDung detailPhieuDichVu(Integer id) {
        return phieuDichVuRepository.findById(id).get();
    }

    @Override
    public DichVuSuDung updatePhieuDichVu(DichVuSuDungRequest dichVuSuDungRequest) {
        // Tìm dịch vụ đi kèm bằng ID
        DichVuSuDung dichVuSuDung = phieuDichVuRepository.findById(dichVuSuDungRequest.getId()).orElse(null);
        if (dichVuSuDung != null) {
            dichVuSuDung.setDichVu(dichVuSuDungRequest.getDichVu());
            dichVuSuDung.setXepPhong(dichVuSuDungRequest.getXepPhong());
            dichVuSuDung.setSoLuongSuDung(dichVuSuDungRequest.getSoLuongSuDung());
            // Thiết lập ngày kết thúc từ yêu cầu
            dichVuSuDung.setNgayKetThuc(dichVuSuDungRequest.getNgayKetThuc());
            dichVuSuDung.setGiaSuDung(dichVuSuDungRequest.getGiaSuDung());
            dichVuSuDung.setTrangThai(dichVuSuDungRequest.getTrangThai());
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
            if (dichVuSuDung.getTrangThai()) {
                dichVuSuDung.setTrangThai(false);
            } else {
                dichVuSuDung.setTrangThai(true);
            }
            phieuDichVuRepository.save(dichVuSuDung);
        }
    }
}
