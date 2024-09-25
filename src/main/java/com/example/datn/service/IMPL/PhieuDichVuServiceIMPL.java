package com.example.datn.service.IMPL;

import com.example.datn.model.PhieuDichVu;
import com.example.datn.repository.PhieuDichVuRepository;
import com.example.datn.service.PhieuDichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public class PhieuDichVuServiceIMPL implements PhieuDichVuService {
    @Autowired
    PhieuDichVuRepository phieuDichVuRepo;
    @Override
    public List<PhieuDichVu> findAll() {
        return phieuDichVuRepo.findAll();
    }

    @Override
    public void addPhieuDichVu(PhieuDichVu phieuDichVu) {
        phieuDichVuRepo.save(phieuDichVu);
    }

    @Override
    public PhieuDichVu detailPhieuDichVu(Integer id) {
        return phieuDichVuRepo.findById(id).get();
    }

    @Override
    public void updatePhieuDichVu(PhieuDichVu phieuDichVu) {
        phieuDichVuRepo.save(phieuDichVu);
    }

    @Override
    public void deletePhieuDichVu(Integer id) {
        phieuDichVuRepo.deleteById(id);
    }
}
