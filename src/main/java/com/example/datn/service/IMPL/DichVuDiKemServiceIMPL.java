package com.example.datn.service.IMPL;

import com.example.datn.model.DichVuDiKem;
import com.example.datn.repository.DichVuDiKemRepository;
import com.example.datn.service.DichVuDiKemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DichVuDiKemServiceIMPL implements DichVuDiKemService {
    @Autowired
    DichVuDiKemRepository dichVuDiKemRepository;

    @Override
    public List<DichVuDiKem> getAll() {
        return dichVuDiKemRepository.findAll();
    }

    @Override
    public void addDichVuDiKem(DichVuDiKem dvdk) {
        dichVuDiKemRepository.save(dvdk);
    }

    @Override
    public DichVuDiKem detailDichVuDiKem(Integer id) {
        return dichVuDiKemRepository.findById(id).get();
    }

    @Override
    public void updateStatus(Integer id) {
        DichVuDiKem dichVuDiKem = dichVuDiKemRepository.findById(id).orElse(null);
        if (dichVuDiKem != null) {
            if (dichVuDiKem.getTrangThai().equals("Hoạt động")) {
                dichVuDiKem.setTrangThai("Ngừng hoạt động");
            } else {
                dichVuDiKem.setTrangThai("Hoạt động");
            }
            dichVuDiKemRepository.save(dichVuDiKem);
        }
    }

    @Override
    public void updateDichVuDiKem(DichVuDiKem dvdk) {
        dichVuDiKemRepository.save(dvdk);
    }

    @Override
    public List<DichVuDiKem> findByAll(String key) {
        return null;
    }
}
