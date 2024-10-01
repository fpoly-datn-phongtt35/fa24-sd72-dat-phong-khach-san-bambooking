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
    public DichVu addDichVu(DichVu dv) {
       return dichVuRepository.save(dv);
    }

    @Override
    public DichVu detailDichVu(Integer id) {
        return dichVuRepository.getReferenceById(id);
    }

    @Override
    public void updateStatus(Integer id) {
        DichVu dichVu = dichVuRepository.findById(id).orElse(null);
        if (dichVu != null) {
            if (dichVu.getTrangThai().equals("Hoạt động")) {
                dichVu.setTrangThai("Ngừng hoạt động");
            } else {
                dichVu.setTrangThai("Hoạt động");
            }
            dichVuRepository.save(dichVu);
        }

    }

    @Override
    public DichVu updateDichVu(DichVu dv) {
        dichVuRepository.save(dv);
        return dv;
    }

    @Override
    public void deleteDichVu(Integer id) {
        dichVuRepository.deleteById(id);
    }

    @Override
    public DichVu findById(Integer id) {
        return dichVuRepository.findById(id).get();
    }

    @Override
    public List<DichVu> findByAll(String key) {
        return dichVuRepository.findByTenDichVu(key);
    }
}
