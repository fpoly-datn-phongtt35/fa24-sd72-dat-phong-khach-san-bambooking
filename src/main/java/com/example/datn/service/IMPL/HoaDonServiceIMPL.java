package com.example.datn.service.IMPL;

import com.example.datn.model.HoaDon;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoaDonServiceIMPL implements HoaDonService {
    @Autowired
    HoaDonRepository hoaDonRepository;

    @Override
    public List<HoaDon> findAll() {
        return hoaDonRepository.findAll();
    }

    @Override
    public void addHoaDon(HoaDon hoaDon) {
        hoaDonRepository.save(hoaDon);
    }

    @Override
    public HoaDon detailHoaDon(Integer id) {
        return hoaDonRepository.findById(id).get();
    }

    @Override
    public void updateHoaDon(HoaDon hoaDon) {
        hoaDonRepository.save(hoaDon);
    }

    @Override
    public void updateStatusHoaDon(Integer id) {
        HoaDon hoaDon = hoaDonRepository.findById(id).orElse(null);
        if (hoaDon != null){
            if (hoaDon.getTrangThai().equals("Chưa thanh toán")){
                hoaDon.setTrangThai("Đã thanh toán");
            }else {
                hoaDon.setTrangThai("Chưa thanh toán");
            }
            hoaDonRepository.save(hoaDon);
        }
    }
}
