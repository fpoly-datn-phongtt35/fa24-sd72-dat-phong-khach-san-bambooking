package com.example.datn.service.IMPL;

import com.example.datn.dto.request.KhachHangCheckinRequest;
import com.example.datn.model.KhachHang;
import com.example.datn.model.KhachHangCheckin;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.KhachHangCheckinRepository;
import com.example.datn.service.KhachHangCheckinService;
import com.example.datn.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KhachHangCheckinServiceIMPL implements KhachHangCheckinService {

    @Autowired
    KhachHangCheckinRepository repository;
    @Override
    public KhachHangCheckin add(KhachHangCheckinRequest request) {
        KhachHangCheckin checkin = new KhachHangCheckin();
        checkin.setKhachHang(request.getKhachHang());
        checkin.setThongTinDatPhong(request.getThongTinDatPhong());
        checkin.setTrangThai(true);
        return repository.save(checkin);
    }

    @Override
    public KhachHangCheckin update(KhachHangCheckinRequest request) {
        KhachHangCheckin checkin = repository.findById(request.getId()).get();
        checkin.setKhachHang(request.getKhachHang());
        checkin.setThongTinDatPhong(request.getThongTinDatPhong());
        checkin.setTrangThai(request.getTrangThai());
        return repository.save(checkin);
    }

    @Override
    public List<KhachHangCheckin> findsByMaTTDP(String maThongTinDatPhong) {
        return repository.findsByMaTTDP(maThongTinDatPhong);
    }
}
