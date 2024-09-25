package com.example.datn.service;

import com.example.datn.model.ThongTinDatPhong;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ThongTinDatPhongService {
    List<ThongTinDatPhong> findAll();
    public void add(ThongTinDatPhong thongTinDatPhong);
    public ThongTinDatPhong detail(Integer id);
    public void update(ThongTinDatPhong thongTinDatPhong);
    public ThongTinDatPhong delete(Integer id);
}
