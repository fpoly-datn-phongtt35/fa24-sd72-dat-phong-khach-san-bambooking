package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DatPhongRequest;
import com.example.datn.dto.response.DatPhongResponse;
import com.example.datn.model.DatPhong;
import com.example.datn.model.NhanVien;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.service.DatPhongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DatPhongServiceIMPL implements DatPhongService {
    @Autowired
    DatPhongRepository datPhongRepository;

    @Autowired
    KhachHangRepository khachHangRepository;

    @Autowired
    NhanVienRepository nhanVienRepository;

    @Override
    public Page<DatPhongResponse> getByTrangThai(String tt, Pageable pageable) {
        return datPhongRepository.DatPhongTheoTrangThai(tt,pageable);
    }

    @Override
    public List<DatPhong> getAll() {
        return datPhongRepository.findAll();
    }

    @Override
    public DatPhong addDatPhong(DatPhongRequest datPhongRequest) {
        DatPhong datPhong = new DatPhong();
        datPhong.setMaDatPhong(datPhongRequest.getMaDatPhong());
        datPhong.setNgayDat(datPhongRequest.getNgayDat());
        datPhong.setGhiChu(datPhongRequest.getGhiChu());
        datPhong.setNhanVien(datPhongRequest.getNhanVien());
        datPhong.setKhachHang(datPhongRequest.getKhachHang());
        datPhong.setTrangThai(datPhongRequest.getTrangThai());
        return datPhongRepository.save(datPhong);
    }

    @Override
    public DatPhongResponse detailDatPhong(Integer id) {
        return null;
    }

    @Override
    public DatPhongResponse updateDatPhong(Integer id, DatPhongRequest datPhongRequest) {
        return null;
    }

    @Override
    public Boolean update(DatPhong datPhong) {
        if(datPhong!=null){
            datPhongRepository.save(datPhong);
            return true;
        }
        return false;
    }

    @Override
    public Boolean delete(Integer id) {
        if(id!=null){
            datPhongRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
