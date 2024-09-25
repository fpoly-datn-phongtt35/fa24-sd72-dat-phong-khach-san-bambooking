package com.example.datn.service;

import com.example.datn.model.HoaDon;

import java.util.List;

public interface HoaDonService {
    List<HoaDon> findAll();
    void addHoaDon(HoaDon hoaDon);
    HoaDon detailHoaDon(Integer id);
    void updateHoaDon(HoaDon hoaDon);
    void updateStatusHoaDon(Integer id);
}
