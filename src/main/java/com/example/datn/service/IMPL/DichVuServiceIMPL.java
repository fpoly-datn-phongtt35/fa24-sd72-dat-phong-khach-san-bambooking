package com.example.datn.service.IMPL;

import com.example.datn.model.DichVu;
import com.example.datn.repository.DichVuRepository;
import com.example.datn.service.DichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DichVuServiceIMPL implements DichVuService {
    @Autowired
    DichVuRepository dichVuRepository;

    @Override
    public List<DichVu> getAll() {
        return dichVuRepository.findAll();
    }

    @Override
    public void addDichVu(DichVu dv) {
        dichVuRepository.save(dv);
    }

    @Override
    public DichVu detailDichVu(Integer id) {
        return dichVuRepository.getReferenceById(id);
    }

    @Override
    public void updateStatus(Integer id) {
        dichVuRepository.getById(id).setTrangThai("Ngừng hoạt động");
    }

    @Override
    public void updateDichVu(DichVu dv) {
        dichVuRepository.save(dv);
    }

    @Override
    public List<DichVu> findByAll(String key) {
        return dichVuRepository.findByTenDichVu(key);
    }
}
