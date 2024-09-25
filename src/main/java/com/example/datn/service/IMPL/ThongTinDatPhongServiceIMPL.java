package com.example.datn.service.IMPL;

import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.service.ThongTinDatPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ThongTinDatPhongServiceIMPL implements ThongTinDatPhongService {
    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Override
    public List<ThongTinDatPhong> findAll() {
        return thongTinDatPhongRepository.findAll();
    }

    @Override
    public void add(ThongTinDatPhong thongTinDatPhong) {
        thongTinDatPhongRepository.save(thongTinDatPhong);
    }

    @Override
    public ThongTinDatPhong detail(Integer id) {
        return thongTinDatPhongRepository.findById(id).get();
    }

    @Override
    public void update(ThongTinDatPhong thongTinDatPhong) {
        thongTinDatPhongRepository.save(thongTinDatPhong);
    }

    @Override
    public ThongTinDatPhong delete(Integer id) {
        Optional<ThongTinDatPhong> chiTietHoaDon = thongTinDatPhongRepository.findById(id);
        if (chiTietHoaDon.isPresent()){
            thongTinDatPhongRepository.delete(chiTietHoaDon.get());
            return chiTietHoaDon.get();
        }
        return null;
    }
}
